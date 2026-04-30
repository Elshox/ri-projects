# Установка ui-ux-pro-max skill в Claude Code

> Step 2 из ТЗ. Нужно выполнить **вручную**, потому что `/plugin` —
> это slash-команды Claude Code CLI, и их нельзя выполнить из агента.

## Команды для Claude Code

Открой проект в терминале и запусти Claude Code:

```bash
cd /Users/elbek/dev/projects/ri-projects
claude
```

В сессии Claude Code введи:

```
/plugin marketplace add nextlevelbuilder/ui-ux-pro-max-skill
/plugin install ui-ux-pro-max@ui-ux-pro-max-skill
```

После установки skill будет автоматически подгружаться при работе
с UI/UX-задачами в этом проекте.

## Альтернатива: вручную через git

Если по какой-то причине `/plugin` команда недоступна, можно
склонировать skill вручную:

```bash
mkdir -p .claude/skills
git clone --depth=1 https://github.com/nextlevelbuilder/ui-ux-pro-max-skill.git .claude/skills/ui-ux-pro-max
```

`.claude/` уже добавлен в `.gitignore` — так что сами файлы skill'а
не попадут в репозиторий.

## Проверка

После установки попроси Claude:

> Покажи что ты знаешь про ui-ux-pro-max skill

Claude должен подгрузить SKILL.md и описать возможности (design system,
UI reasoning, slides, charts и т.д.).
