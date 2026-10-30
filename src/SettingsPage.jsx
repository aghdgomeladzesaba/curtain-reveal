import { Paper, Stack, Title, Text, Select } from '@mantine/core';
import VoiceSelector from './VoiceSelector.jsx';

function SettingsPage({
  theme, onThemeChange, palette,
  language, onLanguageChange, words
}) {
  return (
    <Paper shadow="md" radius="lg" p="xl" withBorder
      style={{
        backgroundColor: palette.surface,
        color: palette.foreground,
        borderColor: palette.accent
      }}>
      <Stack gap="lg">
        <Title order={2} c={palette.foreground}>
          {words.settings.pageTitle}
        </Title>

        <Text c={palette.foreground}>
          {language === 'Russian'
            ? 'Настройте внешний вид приложения.'
            : 'Customize the appearance of your application.'}
        </Text>

        <Select
          label={words.settings.themeLabel}
          data={['Dark', 'Light', 'Matrix', 'Barbie']}
          value={theme}
          onChange={onThemeChange}
          allowDeselect={false}
          styles={{
            label: { color: palette.foreground }
          }}
        />

        <Select
          label={words.settings.languageLabel}
          data={['English', 'Russian']}
          value={language}
          onChange={onLanguageChange}
          allowDeselect={false}
          styles={{
            label: { color: palette.foreground }
          }}
        />
        <VoiceSelector
          language={language}
          palette={palette}
        />
      </Stack>
    </Paper>
  );
}

export default SettingsPage;
