import { useState, useRef } from 'react';
import { Container, Title, Text, Button, Stack, Paper, Group } from '@mantine/core';
import Tuna from 'tunajs';
import SettingsPage from './SettingsPage.jsx';
import AboutPage from './AboutPage.jsx';
import HelpPage from './HelpPage.jsx';
import english from '../data/textEnglish.json';
import russian from '../data/textRussian.json';
import './curtains.css';

function App() {
  const [page, setPage] = useState('Home');
  const [theme, setTheme] = useState('Dark');
  const [language, setLanguage] = useState('English');
  const words = language === 'Russian' ? russian : english;
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const audioGraphRef = useRef(null);

  const palette = {
    Dark: {
      background: '#141414',
      surface: '#252525',
      foreground: '#ffffff',
      accent: '#fa5252'
    },
    Light: {
      background: '#f1f3f5',
      surface: '#ffffff',
      foreground: '#212529',
      accent: '#228be6'
    },
    Matrix: {
      background: '#000000',
      surface: '#071b0c',
      foreground: '#00ff41',
      accent: '#008f11'
    },
    Barbie: {
      background: '#ffe0f0',
      surface: '#fff0f7',
      foreground: '#9c1458',
      accent: '#ff1493'
    }
  }[theme];

  async function startReveal() {
    setIsOpen(false);
    setIsPlaying(true);

    try {
      const audio = audioRef.current;

      if (!audioGraphRef.current) {
        const context = new AudioContext();
        const tuna = new Tuna(context);

        const reverb = new tuna.Convolver({
          impulse: '/assets/audio/reverb.wav',
          dryLevel: 0.8,
          wetLevel: 0.7,
          level: 0.8,
          bypass: false
        });

        const source = context.createMediaElementSource(audio);
        source.connect(reverb);
        reverb.connect(context.destination);

        audioGraphRef.current = { context, source, reverb };
      }

      await audioGraphRef.current.context.resume();
      audio.currentTime = 0;
      await audio.play();

    } catch (error) {
      console.error('Audio error:', error);
      setIsPlaying(false);
    }
  }

  function finishAudio() {
    setIsPlaying(false);
    setIsOpen(true);

    // Speak after the curtains finish opening
    setTimeout(() => {
      if ('speechSynthesis' in window) {
        speechSynthesis.cancel();

        const message = new SpeechSynthesisUtterance('It is done');
        message.lang = 'en-US';
        message.rate = 0.85;
        message.pitch = 0.8;

        // Use the voice selected in Settings
        const savedVoice = localStorage.getItem('curtainVoice');
        const availableVoices = speechSynthesis.getVoices();

        const chosenVoice = availableVoices.find(
          voice => voice.voiceURI + '|' + voice.lang === savedVoice
        );

        if (chosenVoice) {
          message.voice = chosenVoice;
          message.lang = chosenVoice.lang;
        }

        speechSynthesis.speak(message);
      }
    }, 2000);
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: palette.background,
      color: palette.foreground
    }}>
      <Container size="md" py="xl">
      <Group justify="center" mb="lg">
        <Button onClick={() => setPage('Home')}>
          {words.navigation.home}
        </Button>
        <Button onClick={() => setPage('Settings')}>
          {words.navigation.settings}
        </Button>
        <Button onClick={() => setPage('About')}>
          {words.navigation.about}
        </Button>
        <Button onClick={() => setPage('Help')}>
          {words.navigation.help}
        </Button>
      </Group>

      {page === 'Home' ? (
      <Paper shadow="md" radius="lg" p="xl" withBorder
        style={{
          backgroundColor: palette.surface,
          color: palette.foreground,
          borderColor: palette.accent
        }}>
        <Stack align="center" gap="lg">
          <Title order={1} c={palette.foreground}>{words.home.pageTitle}</Title>

          <Text ta="center" c={palette.foreground}>
            Click the button to hear a mysterious message
            and reveal the surprise!
          </Text>

          <audio
            ref={audioRef}
            src="/assets/audio/voice.mp3"
            onEnded={finishAudio}
          />

          <div className={`curtain-stage ${isOpen ? 'open' : ''}`}>
            <div style={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '26px'
            }}>
              <img
              src="/assets/images/newspaper.jpg"
              alt="Edited vintage newspaper"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain'
              }}
            />
            </div>

            <div className="curtain curtain-left"></div>
            <div className="curtain curtain-right"></div>
          </div>

          <Button
            size="lg"
            color="red"
            onClick={startReveal}
            disabled={isPlaying}
          >
            {isPlaying ? words.home.playingText : words.home.buttonText}
          </Button>
        </Stack>
      </Paper>
      ) : page === 'Settings' ? (
        <SettingsPage
          theme={theme}
          onThemeChange={setTheme}
          palette={palette}
          language={language}
          onLanguageChange={setLanguage}
          words={words}
        />
      ) : page === 'About' ? (
        <AboutPage words={words} palette={palette} />
      ) : (
        <HelpPage words={words} palette={palette} />
      )}
      </Container>
    </div>
  );
}

export default App;
