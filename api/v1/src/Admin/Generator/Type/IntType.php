<?php

namespace Admin\Generator\Type;

final class IntType implements TypeInterface
{
    public function getName(): string
    {
        return "int";
    }

    public function getEntityProperty(): string
    {
        return <<<EOL
    /**
     * @var bool
     *
     * @ORM\Type INT(9)
     * @ORM\Column {{ item.slug }}
     */
    private \${{ item.slug }} = false;
    
EOL;

    }

    public function getEntityMethods(): string
    {
        return <<<EOL
    /**
     * @return int
     */
    public function get{{ item.slugInCamel }}(): int
    {
        return \$this->{{ item.slug }};
    }

    /**
     * @param int \${{ item.slug }}
     */
    public function set{{ item.slugInCamel }}(int \${{ item.slug }})
    {
        \$this->{{ item.slug }} = \${{ item.slug }};
    }

EOL;
    }

    public function getSet(): string
    {
        return <<<EOL
        \${{ module.slugSingular }}->set{{ item.slugInCamel }}(isset(\$data["{{ item.slug }}"]) ? (int) \$data["{{ item.slug }}"] : 0);
EOL;
    }

    public function getForm(): string
    {
        return <<<EOL
            <div class="form-group">
                <label for="form_edit_{{ item.slug }}">{{ item.name }}</label>
                <input value="{{ "{{" }} {{ module.slugSingular }}.{{ item.slugInCamel }} {{ "}}" }}" type="number" name="{{ item.slug }}" class="form-control" id="form_edit_{{ item.slug }}">
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