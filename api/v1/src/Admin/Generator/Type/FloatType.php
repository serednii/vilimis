<?php

namespace Admin\Generator\Type;

final class FloatType implements TypeInterface
{
    public function getName(): string
    {
        return "float";
    }

    public function getEntityProperty(): string
    {
        return <<<EOL
    /**
     * @var float
     *
     * @ORM\Type DOUBLE(7,5)
     * @ORM\Column {{ item.slug }}
     */
    private \${{ item.slug }} = false;
    
EOL;

    }

    public function getEntityMethods(): string
    {
        return <<<EOL
    /**
     * @return float
     */
    public function get{{ item.slugInCamel }}(): float
    {
        return \$this->{{ item.slug }};
    }

    /**
     * @param float \${{ item.slug }}
     */
    public function set{{ item.slugInCamel }}(float \${{ item.slug }})
    {
        \$this->{{ item.slug }} = \${{ item.slug }};
    }

EOL;
    }

    public function getSet(): string
    {
        return <<<EOL
        \${{ module.slugSingular }}->set{{ item.slugInCamel }}(isset(\$data["{{ item.slug }}"]) ? (float) \$data["{{ item.slug }}"] : 0);
EOL;
    }

    public function getForm(): string
    {
        return <<<EOL
            <div class="form-group">
                <label for="form_edit_{{ item.slug }}">{{ item.name }}</label>
                <input value="{{ "{{" }} {{ module.slugSingular }}.{{ item.slugInCamel }} {{ "}}" }}" type="number" name="{{ item.slug }}" class="form-control" id="form_edit_{{ item.slug }}"
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
        return 400;
    }
}