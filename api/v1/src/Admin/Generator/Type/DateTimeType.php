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
     * @var \DateTime|null
     *
     * @ORM\Type DATETIME
     * @ORM\Column {{ item.slug }}
     */
    private \${{ item.slug }} = null;
    
EOL;

    }

    public function getEntityMethods(): string
    {
        return <<<EOL
    /**
     * @return \DateTime|null
     */
    public function get{{ item.slugInCamel }}(): ?\DateTime
    {
        return \$this->{{ item.slug }};
    }

    /**
     * @param \DateTime|null \${{ item.slug }}
     */
    public function set{{ item.slugInCamel }}(?\DateTime \${{ item.slug }})
    {
        \$this->{{ item.slug }} = \${{ item.slug }};
    }

EOL;
    }

    public function getSet(): string
    {
        return <<<EOL
        \${{ module.slugSingular }}->set{{ item.slugInCamel }}(!empty(\$data["{{ item.slug }}"]) ? new \DateTime(\$data["{{ item.slug }}"]) : null);
EOL;
    }

    public function getForm(): string
    {
        return <<<EOL
            <div class="form-group">
                <label for="form_edit_{{ item.slug }}">{{ item.name }}</label>
                <input value="{{ "{{" }} {{ module.slugSingular }}.{{ item.slugInCamel }}.format("Y-m-d H:i") {{ "}}" }}" type="datetime-local" name="{{ item.slug }}" class="form-control" id="form_edit_{{ item.slug }}"
                {% if item.required %}required="required"{% endif %}>
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