import { useState, useEffect } from 'react';
import { Select } from '@mantine/core';

function VoiceSelector({ language, palette }) {
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(
    () => localStorage.getItem('curtainVoice') || 'default'
  );

  useEffect(() => {
    if (!('speechSynthesis' in window)) return;

    const loadVoices = () => {
      setVoices(window.speechSynthesis.getVoices());
    };

    loadVoices();
    window.speechSynthesis.addEventListener(
      'voiceschanged', loadVoices
    );

    return () => {
      window.speechSynthesis.removeEventListener(
        'voiceschanged', loadVoices
      );
    };
  }, []);

  const voiceOptions = [
    {
      value: 'default',
      label: 'Browser Default'
    },
    ...voices.map(voice => ({
      value: voice.voiceURI + '|' + voice.lang,
      label: `${voice.name} (${voice.lang})`
    }))
  ];

  function changeVoice(value) {
    const chosen = value || 'default';
    setSelectedVoice(chosen);
    localStorage.setItem('curtainVoice', chosen);
  }

  return (
    <Select
      label={
        language === 'Russian'
          ? 'Выберите голос'
          : 'Choose a Computer Voice'
      }
      description={
        language === 'Russian'
          ? 'Выберите голос для финального сообщения'
          : 'Choose who says "It is done"'
      }
      data={voiceOptions}
      value={selectedVoice}
      onChange={changeVoice}
      searchable
      allowDeselect={false}
      styles={{
        label: { color: palette.foreground },
        description: { color: palette.foreground }
      }}
    />
  );
}

export default VoiceSelector;
