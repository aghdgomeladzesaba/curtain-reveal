import { Paper, Stack, Title, Text } from '@mantine/core';

function AboutPage({ words, palette }) {
  return (
    <Paper shadow="md" radius="lg" p="xl" withBorder
      style={{
        backgroundColor: palette.surface,
        color: palette.foreground,
        borderColor: palette.accent
      }}>
      <Stack gap="md">
        <Title order={2} c={palette.foreground}>
          {words.about.pageTitle}
        </Title>

        <Text c={palette.foreground}>
          {words.about.para1}
        </Text>

        <Text c={palette.foreground}>
          {words.about.para2}
        </Text>
      </Stack>
    </Paper>
  );
}

export default AboutPage;
