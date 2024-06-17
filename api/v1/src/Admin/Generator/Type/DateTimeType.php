<?php

namespace Admin\Generator\Type;

final class DateTimeType implements TypeInterface
{
    public function getName(): string
    {
        return "datetime";
    }

    public function getEntityProperty(): string
    {
        return <<<EOL
    /**
     * @var \DateTime
     *
     * @ORM\Type DATETIME
     * @ORM\Column {{ item.slug }}
     */
    private \${{ item.slug }} = "";
    
EOL;

    }

    public function getEntityMethods(): string
    {
        return <<<EOL
    /**
     * @return \DateTime
     */
    public function get{{ item.slugInCamel }}(): \DateTime
    {
        return \$this->{{ item.slug }};
    }

    /**
     * @param \DateTime \${{ item.slug }}
     */
    public function set{{ item.slugInCamel }}(\DateTime \${{ item.slug }})
    {
        \$this->{{ item.slug }} = \${{ item.slug }};
    }

EOL;
    }

    public function getSet(): string
    {
        return <<<EOL
        \${{ module.slugSingular }}->set{{ item.slugInCamel }}(new \DateTime(\$data["{{ item.slug }}"]));
EOL;
    }

    public function getForm(): string
    {
        return <<<EOL
            <div class="form-group">
                <label for="form_edit_{{ item.slug }}">{{ item.name }}</label>
                <input value="{{ "{{" }} {{ module.slugSingular }}.{{ item.slugInCamel }}.format("Y-m-d H:i") {{ "}}" }}" type="datetime-local" name="{{ item.slug }}" class="form-control" id="form_edit_{{ item.slug }}">
            </div>
EOL;

    }

    public function getShow(): string
    {
        return <<<EOL
                        {{ "{{" }} {{ module.slugSingular }}.{{ item.slugInCamel }}.format("d. m. Y H:i") {{ "}}" }}
EOL;

    }

    public function getPriority(): int
    {
        return 300;
    }
}