<?php

namespace API\Controller;

use API\Entity\Client;
use API\Entity\Invoice;
use API\Entity\InvoiceItem;
use API\Repository\InvoiceItemRepository;
use API\Repository\InvoiceRepository;
use API\Repository\SettingRepository;
use API\Repository\UserRepository;
use API\Repository\ClientRepository;
use Defr\QRPlatba\QRPlatba;
use Gephart\EventManager\Event;
use Gephart\EventManager\EventManager;
use Gephart\Framework\Facade\EntityManager;
use Gephart\Framework\Facade\Request;
use Gephart\Framework\Facade\Router;
use Psr\Http\Message\UploadedFileInterface;
use API\Service\JsonSerializator;
use Gephart\Framework\Response\JsonResponseFactory;

/**
 * @RoutePrefix /invoicePdf
 */
class InvoicePdfController extends AbstractApiController
{

    /**
     * @var EventManager
     */
    private $eventManager;

    /**
     * @var InvoiceRepository
     */
    private $invoice_repository;

    /**
     * @var JsonResponseFactory
     */
    private $jsonResponseFactory;

    /**
     * @var JsonSerializator
     */
    private $jsonSerializator;

    private InvoiceItemRepository $invoice_item_repository;
    private ClientRepository $clientRepository;
    private SettingRepository $settingRepository;


    public function __construct(
        InvoiceRepository $invoice_repository,
        InvoiceItemRepository $invoice_item_repository,
        JsonResponseFactory $jsonResponseFactory,
        ClientRepository $clientRepository,
        JsonSerializator $jsonSerializator,
        SettingRepository $settingRepository,
        EventManager $eventManager
    )
    {
        $this->invoice_repository = $invoice_repository;
        $this->jsonResponseFactory = $jsonResponseFactory;
        $this->jsonSerializator = $jsonSerializator;
        $this->eventManager = $eventManager;
        $this->invoice_item_repository = $invoice_item_repository;
        $this->clientRepository = $clientRepository;
        $this->settingRepository = $settingRepository;
    }

    /**
     * @Route {
     *  "rule": "/{id}",
     *  "name": "invoicePdf"
     * }
     */
    public function single($id)
    {
        $invoice = $this->invoice_repository->find($id);
        $settings = $this->settingRepository->findBy();
        foreach ($settings as $setting) {
            $settings[$setting->getKey()] = $setting->getValue();
        }

        if (!$invoice) {
            return $this->jsonResponseFactory->createResponse($this->jsonSerializator->serialize([
                "message" => "Nenalezeno",
                "code" => 404
            ]));
        }

        /** @var Invoice $invoice */
        $invoice = $this->invoice_repository->find($id);
        $invoice_items = $this->invoice_item_repository->findBy(["invoice_id = %1", $id]);

        /** @var Client $client */
        $client = $this->clientRepository->find($invoice->getClientId());

        $user = new \stdClass();
        $user->name = $settings["name"];
        $user->invoiceNote = $settings["invoice_note"];
        $user->address = $settings["address"];
        $user->email = $settings["email"];
        $user->ic = $settings["ic"];
        $user->dic = $settings["dic"];
        $user->phone = $settings["phone"];
        $user->bank_name = $settings["bank"];
        $user->bank_number = $settings["account_number"];
        /*
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; '.(isset($address_dodavatel[0])?$address_dodavatel[0]:'').'<br>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; '.(isset($address_dodavatel[1])?$address_dodavatel[1]:'').'<br>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; '.(isset($address_dodavatel[2])?$address_dodavatel[2]:'').'

        <br>
        <table style="font-family:sans-serif;font-size:12px;">
            <tr>
                <td>Telefon: '.$user->phone.'</td>
                <td style="padding-left:10px;">IČ: '.$user->ic.'</td>
            </tr>
            <tr>
                <td>Email: '.$user->email.'</td>
                <td style="padding-left:10px;">DIČ: '.$user->dic.'</td>
            </tr>
        </table>




        <br>
        <div style="font-size:12px;">
            '.$client->invoice_note.'
        </div><br>
         */

        $sum_quantity = 0;
        $count_quantity = 0;
        $sum_dph = 0;

        /** @var InvoiceItem $item */
        foreach ($invoice_items as $item) {
            $sum_quantity += $item->getQuantity();
            $count_quantity++;
        }

        $html = '
<style>
div.marginLeft {
    font-size:16px;
}
</style>
<div style="margin-left:400px;width:30%;text-align:center;border:1px solid black;border-bottom:none;font-family: sans-serif;padding:5px 10px;border-radius:5px 5px 0 0;">
'.$invoice->getInvoiceType().': <span style="color:red; font-weight:bold;">'.$invoice->getNumber().'</span>
</div>
<div style="border:2px solid black; border-radius: 15px 15px 15px 15px">
<table style="width:100%; font-family:sans-serif;font-size:12px;">
<tr>
    <td style="width:50%; border-right:1px solid black; vertical-align:top; padding:5px; padding-bottom:0;">
        <h2 style="font-family:sans-serif;font-size:16px;">Dodavatel:</h2>
        <br>
        <div class="marginLeft" style="padding-left:30px">
            <strong>'.$user->name.'</strong><br>
            '.nl2br($user->address).'
        </div>
        <br>
        <table style="font-family:sans-serif;font-size:12px;">
            <tr>
                <td>Telefon: '.$user->phone.'</td>
                <td style="padding-left:10px;">IČ: '.$user->ic.'</td>
            </tr>
            <tr>
                <td>Email: '.$user->email.'</td>
                <td style="padding-left:10px;">DIČ: '.$user->dic.'</td>
            </tr>
        </table>
        <br>
        <div style="font-size:12px;">
            '.nl2br($user->invoiceNote).'
        </div><br>
    </td>
    <td style="width:50%; x_border:1px solid black; vertical-align:top; padding:5px;">
        <h2 style="font-family:sans-serif;font-size:16px;">Odběratel:</h2>
        <br>
        <div class="marginLeft" style="padding-left:30px">
           <strong>'.$client->getName().'</strong><br>
           '.nl2br($client->getAddress()).'
        </div>
        <br>
        <table style="font-family:sans-serif;font-size:12px;">
            <tr>
                <td>Telefon: '.$client->getPhone().'</td>
                <td style="padding-left:10px;">IČ: '.$client->getIc().'</td>
            </tr>
            <tr>
                <td>Email: '.$client->getEmail().'</td>
                <td style="padding-left:10px;">DIČ: '.$client->getDic().'</td>
            </tr>
        </table>
    </td>
</tr>
<tr>
    <td style="width:100%; border-top:2px solid black; vertical-align:top; padding:5px;" colspan="2">
        <h2 style="font-size:16px;">Platební podmínky:</h2>
        <table style="font-size:12px;">
            <tr>
                <td style="width:330px; vertical-align:top;">
                    <table>
                        <tr>
                            <td>Forma úhrady: </td><td style="padding-left:5px;">'.$invoice->getFormOfPayment().'</td>
                        </tr>
                        <tr>
                            <td>Banka: </td><td style="padding-left:5px;">'.$user->bank_name.'</td>
                        </tr>
                        <tr>
                            <td>Číslo účtu: </td><td style="padding-left:5px;"><strong>'.$user->bank_number.'</strong></td>
                        </tr>
                        '.(($invoice->getVariableSymbol()!='')?'
                        <tr>
                            <td>Variabilní symbol: </td><td style="padding-left:5px;"><span style="color:red; font-weight:bold;">'.$invoice->getVariableSymbol().'</span></td>
                        </tr>
                        ':'').'
                        '.(($invoice->getSpecificSymbol()!='')?'
                        <tr>
                            <td>Specifický symbol: </td><td style="padding-left:5px;">'.$invoice->getSpecificSymbol().'</td>
                        </tr>
                        ':'').'
                        '.(($invoice->getConstantSymbol()!='')?'
                        <tr>
                            <td>Konstantní symbol: </td><td style="padding-left:5px;">'.$invoice->getConstantSymbol().'</td>
                        </tr>
                        ':'').'
                    </table>
                </td>
                <td style="vertical-align:top;"> 
                    <table>
                        <tr>
                            <td>Datum vystavení: </td><td style="padding-left:5px;">'.$invoice->getCreatedDate()->format("d. m. Y").'</td>
                        </tr>
                        <tr>
                            <td>Datum splatnosti: </td><td style="padding-left:5px;"><strong>'.$invoice->getDueDate()->format("d. m. Y").'</strong></td>
                        </tr>'.($invoice->getDutyDate()->format("Y-m-d") > '1999-00-00'?'
                        <tr>
                            <td>DUZP: </td><td style="padding-left:5px;"><strong>'.$invoice->getDutyDate()->format("d. m. Y").'</strong></td>
                        </tr>' : '').'
                    </table>
                </td>
            </tr>
        </table>
    </td>
</tr>
<tr>
    <td colspan="2" style="width:100%; border-top:2px solid black; border-bottom:0px solid black; vertical-align:top; padding:5px;">
        <table style="width:100%;">';
        $is_quantity = ($sum_quantity/$count_quantity!=1);
        if ($sum_dph) {
            $html .= '<tr>
                <th style="width:20px;">Kód</th>
                <th style="width:500px;">Položka</th>';
            if ($is_quantity) {
                $html .= '
                    <th style="width:65px;">Množství</th>
                    <th style="width:40px;">DPH</th>
                    <th style="width:120px;">Cena za jednotku<br>bez DPH</th>
                    <th style="width:120px;">Celková cena<br>bez DPH</th>
                </tr>';
            } else {
                $html .= '
                    <th style="width:40px;">DPH</th>
                    <th style="width:120px;">Cena bez DPH</th>
                </tr>';
            }
        } else {
            $html .= '<tr>
                <th style="width:20px;">Kód</th>
                <th>Položka</th>
            ';
            if ($is_quantity) {
                $html .= '
                <th style="width:65px;">Množství</th>
                <th style="width:150px;">Cena za jednotku</th>
                </tr>';
            } else {
                $html .= '
                <th style="width:100px;">Cena</th>
                </tr>';
            }
        }
        $celkem_bez = 0;
        $celkem_s = 0;
        $dph_m = 0;
        $dph_v = 0;

        /** @var InvoiceItem $item */
        foreach($invoice_items as $item) {
            $kod = $item->getCode();
            $polozka = $item->getItem();
            $mnozstvi = $item->getQuantity();
            $dph = $item->getVat();
            $cena_bez = $item->getPriceWithoutVat();
            $cena_s = $cena_bez * ($dph/100+1);
            $cena_dph = $cena_s - $cena_bez;
            if ($dph == 14) {
                $dph_m += $mnozstvi*$cena_dph;
            } else if ($dph == 20) {
                $dph_v += $mnozstvi*$cena_dph;
            }
            $celkem_bez += $mnozstvi*$cena_bez;
            $celkem_s += $mnozstvi*$cena_s;
            if ($sum_dph) {
                $html .= '
            <tr>
                <td style="border-top:1px dotted black">'.$kod.'</td>
                <td style="border-top:1px dotted black">'.$polozka.'</td>';

                if ($is_quantity) {
                    $html .='<td style="border-top:1px dotted black;text-align:right;">'.$mnozstvi.' '. $item->getUnit().'</td>
                <td style="border-top:1px dotted black;text-align:right;">'.$dph.'%</td>
                <td style="border-top:1px dotted black;text-align:right;">'.number_format($cena_bez, 2, ',', ' ').' Kč</td>
                <td style="border-top:1px dotted black;text-align:right;">'.number_format($cena_bez*$mnozstvi, 2, ',', ' ').' Kč</td> ';
                }else {
                    $html .='
                <td style="border-top:1px dotted black;text-align:right;">'.$dph.'%</td>
                <td style="border-top:1px dotted black;text-align:right;">'.number_format($cena_bez, 2, ',', ' ').' Kč</td>';
                }
                $html .= '
            </tr>
    ';
            } else {
                $html .= '
            <tr>
                <td style="border-top:1px dotted black">'.$kod.'</td>
                <td style="border-top:1px dotted black">'.$polozka.'</td>';

                if ($is_quantity) {
                    $html .='
                <td style="border-top:1px dotted black;text-align:right;">'.$mnozstvi.' '. $item->getUnit().'</td>
                <td style="border-top:1px dotted black;text-align:right;">'.number_format($cena_bez, 2, ',', ' ').' Kč</td> ';
                }else {
                    $html .='
                <td style="border-top:1px dotted black;text-align:right;">'.number_format($cena_bez, 2, ',', ' ').' Kč</td>';
                }
                $html .= '
            </tr>
    ';
            }
        }
        $celkem_bez = $celkem_bez?round($celkem_bez*100)/100:0;
        $celkem_s = $celkem_s?round($celkem_s*100)/100:0;
        $dph_m = $dph_m?round($dph_m*100)/100:0;
        $dph_v = $dph_v?round($dph_v*100)/100:0;
        if ($sum_dph) {
            $cols = $is_quantity?5:3;
            $html .= '<tr>
                <td colspan="'.$cols.'" style="border-top:1px solid black;">Celkem bez DPH</td>
                <td style="border-top:1px solid black;text-align:right;">'. number_format($celkem_bez, 2, ',', ' ') .' Kč</td>
            </tr>
            
            <tr>
                <td colspan="'.$cols.'" style="border-top:1px dotted black">DPH 14%</td>
                <td style="border-top:1px dotted black;text-align:right;">'. number_format($dph_m, 2, ',', ' ') .' Kč</td>
            </tr>
            
            <tr>
                <td colspan="'.$cols.'" style="border-top:1px dotted black">DPH 20%</td>
                <td style="border-top:1px dotted black;text-align:right;">'. number_format($dph_v, 2, ',', ' ') .' Kč</td>
            </tr>
            
            <tr>
                <td colspan="'.$cols.'" style="font-weight:bold;border-top:1px solid black;">Celkem (včetně DPH)</td>
                <td style="font-weight:bold;border-top:1px solid black;text-align:right;">'. number_format($celkem_s, 2, ',', ' ') .' Kč</td>
            </tr>';
        } else {
            $cols = $is_quantity?3:2;
            $html .= '         
            <tr>
                <td colspan="'.$cols.'" style="font-weight:bold;border-top:1px solid black;">Celkem</td>
                <td style="font-weight:bold;border-top:1px solid black;text-align:right;">'. number_format($celkem_s, 2, ',', ' ') .' Kč</td>
            </tr>';
        }


        $qrPlatba = new QRPlatba();
        $qrPlatba->setAccount($settings["account_number"]) // nastavení č. účtu
        ->setIBAN($settings["iban"]) // nastavení č. účtu
        ->setVariableSymbol($invoice->getVariableSymbol())
            ->setMessage('QR platba')
            ->setAmount($celkem_s)
            ->setCurrency('CZK') // Výchozí je CZK, lze zadat jakýkoli ISO kód měny
            ->setDueDate(new \DateTime());

        $html .= '</table>        
    </td>
</tr>
<!--
<tr>
    <td style="width:50%; border-right:1px solid black; vertical-align:top; padding:5px;">
        <h2 style="font-size:12px; font-weight:normal;">Podpis a razítko dodavatele:</h2>
        <br>
    </td>
    <td style="width:50%; x_border:1px solid black; vertical-align:top; padding:5px;">
        <h2 style="font-size:12px; font-weight:normal;">Podpis a razítko odběratele:</h2>
        <br>      
        <br>      
        <br>      
        <br>      
        <br>      
        <br>      
        <br>      
    </td>
</tr>
-->
</table>
</div><br/>
'.$qrPlatba->getQRCodeImage(true, 200);
//echo $html;exit;
//$mpdf=new mPDF();

        $mpdf = new \Mpdf\Mpdf();

        $mpdf->WriteHTML($html);
        $name = "Faktura_".$invoice->getNumber().'.pdf';
        $content = $mpdf->Output($name,  \Mpdf\Output\Destination::INLINE);
        echo $content;
        exit;
    }
}