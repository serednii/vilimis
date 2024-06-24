<?php

namespace Admin\Generator\Type;

final class PasswordType implements TypeInterface
{
    public function getName(): string
    {
        return "password";
    }

    public function getEntityProperty(): string
    {
        return <<<EOL
    /**
     * @var string
     *
     * @ORM\Type VARCHAR(255)
     * @ORM\Column {{ item.slug }}
     */
    private \${{ item.slug }} = "";
    
EOL;

    }

    public function getEntityMethods(): string
    {
        return <<<EOL
    /**
     * @return string
     */
    public function get{{ item.slugInCamel }}(): string
    {
        return \$this->{{ item.slug }};
    }

    /**
     * @param string \${{ item.slug }}
     */
    public function set{{ item.slugInCamel }}(string \${{ item.slug }})
    {
        \$this->{{ item.slug }} = \${{ item.slug }};
    }

EOL;
    }

    public function getSet(): string
    {
        return <<<EOL
        if (\$data["{{ item.slug }}"]) {
            \${{ item.slug }} = \$data["{{ item.slug }}"];
            if (!empty(\$provider["salt"])) {
                \${{ item.slug }} .= \$securityProvider["salt"];
            }
            \${{ item.slug }}_hash = password_hash(\${{ item.slug }}, PASSWORD_BCRYPT, ["cost" => \$securityProvider["cost"]]);
            \${{ module.slugSingular }}->set{{ item.slugInCamel }}(\${{ item.slug }}_hash);
        }
EOL;
    }

    public function getForm(): string
    {
        return <<<EOL
            <div class="form-group">
                <label for="form_edit_{{ item.slug }}">{{ item.name }} (Pokud nebude vyplněno, nedojde ke změně</label>
                <input type="password" name="{{ item.slug }}" class="form-control" id="form_edit_{{ item.slug }}"
                {% if item.required %}required="required"{% endif %}>
            </div>
EOL;

    }

    public function getShow(): string
    {
        return <<<EOL
                        {{ "{{" }} {{ module.slugSingular }}.{{ item.slugInCamel }} {{ "}}" }}
EOL;

    }

    public function getPriority(): int
    {
        return 600;
    }
}