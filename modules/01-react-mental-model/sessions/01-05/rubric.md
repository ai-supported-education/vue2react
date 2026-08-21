# Rubric 01-05

## Обязательно

- Timeout использует значение операции на момент click.
- Select остаётся controlled.
- Нет effect для копирования recipient.
- Нет чтения latest ref внутри timeout.
- Нет оставшегося latestRecipient ref или его синхронизации: после исправления у
  него нет предметной обязанности.
- Status остаётся React state.

## Допустимо

- Явная локальная константа внутри handler.
- Прямое использование recipient из closure handler.
