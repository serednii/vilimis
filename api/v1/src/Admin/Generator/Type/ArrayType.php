<?php

namespace Admin\Generator\Type;

final class ArrayType implements TypeInterface
{
    public function getName(): string
    {
        return "array";
    }

    public function getEntityProperty(): string
    {
        return <<<EOL
    /**
     * @var string
     *
     * @ORM\Type TEXT
     * @ORM\Column {{ item.slug }}
     */
    private \${{ item.slug }} = "";
    
EOL;

    }

    public function getEntityMethods(): string
    {
        return <<<EOL
    /**
     * @return array|null
     */
    public function get{{ item.slugInCamel }}(): ?array
    {
        try {
            return json_decode(\$this->{{ item.slug }});
        } catch (\Exception \$exception) {
            return [];
        } 
    }

    /**
     * @param array|string|null \${{ item.slug }}
     */
    public function set{{ item.slugInCamel }}(array|string|null \${{ item.slug }})
    {
        if (is_array(\${{ item.slug }})) {
            \${{ item.slug }} = json_encode(\${{ item.slug }});
        }
        \$this->{{ item.slug }} = \${{ item.slug }};
    }

EOL;
    }

    public function getSet(): string
    {
        return <<<EOL
        \${{ module.slugSingular }}->set{{ item.slugInCamel }}(explode(";", \$data["{{ item.slug }}"]));
EOL;
    }

    public function getForm(): string
    {
        return <<<EOL
            <div class="form-group">
                <label for="form_edit_{{ item.slug }}">{{ item.name }} (oddělte středníkem)</label>
                <input value="{{ "{{" }} {{ module.slugSingular }}.{{ item.slugInCamel }}|join(';') {{ "}}" }}" type="text" name="{{ item.slug }}" class="form-control" id="form_edit_{{ item.slug }}"
                {% if item.required %}required="required"{% endif %}>
            </div>
EOL;

    }

    public function getShow(): string
    {
        return <<<EOL
                        {{ "{{" }} {{ module.slugSingular }}.{{ item.slugInCamel }} {{ "}}"|join(';') }}
EOL;

    }

    public function getPriority(): int
    {
        return 600;
    }
}