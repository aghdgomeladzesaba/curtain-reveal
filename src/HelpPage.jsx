import { Paper, Stack, Title, Text } from '@mantine/core';

function HelpPage({ words, palette }) {
  return (
    <Paper shadow="md" radius="lg" p="xl" withBorder
      style={{
        backgroundColor: palette.surface,
        color: palette.foreground,
        borderColor: palette.accent
      }}>
      <Stack gap="md">
        <Title order={2} c={palette.foreground}>
          {words.help.pageTitle}
        </Title>

        <Text c={palette.foreground}>
          {words.help.para1}
        </Text>
      </Stack>
    </Paper>
  );
}

export default HelpPage;
