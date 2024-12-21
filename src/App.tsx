import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import { Container, Row, Col, Button, Stack } from 'react-bootstrap'

import { useStore } from './hooks/useStore'
import { AUTO_LANGUAGE, VOICE_FOR_LANGUAJE } from './constants'
import { CopyIcon, InterchangeIcon, SpeakerIcon } from './components/Icons'
import { LanguageSelector } from './components/LanguageSelector'
import { SectionType } from './types.d'
import { TextArea } from './components/TextArea'
import { useEffect } from 'react'
import { translate } from './services/translate.ts'
import { useDebounce } from './hooks/useDebounce.ts'

function App() {
  const {
    fromLanguage,
    toLanguage,
    fromText,
    result,
    loading,
    interchangeLanguages,
    setFromLanguage,
    setToLanguage,
    setFromText,
    setResult
  } = useStore()

  const debounceFromText = useDebounce(fromText)

  useEffect(() => {
    if (debounceFromText === '') return

    translate({ fromLanguage: fromLanguage, toLanguage: toLanguage, text: debounceFromText })
      .then((result) => {
        if (result == null) return
        setResult(result)
      })
      .catch(() => {
        setResult('Error')
      })

  }, [debounceFromText, fromLanguage, toLanguage])

  const isDisabledInterchangeLanguage = fromLanguage === AUTO_LANGUAGE;

  const handleClipboard = () => {
    navigator.clipboard.writeText(result).catch(() => { })
  }

  const handleSpeak = () => {
    const utterance = new SpeechSynthesisUtterance(result)
    utterance.lang = VOICE_FOR_LANGUAJE[toLanguage]
    utterance.rate = 0.80
    speechSynthesis.speak(utterance)
  }

  return (
    <Container fluid>
      <h2>TransL➰con CHAT-GPT</h2>
      <Row>
        <Col>
          <Stack gap={2}>
            <LanguageSelector
              type={SectionType.From}
              value={fromLanguage}
              onChange={setFromLanguage}
            />

            <TextArea
              type={SectionType.From}
              value={fromText}
              onChange={setFromText}
            />
          </Stack>

        </Col>
        <Col xs='auto'>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              variant='link'
              disabled={isDisabledInterchangeLanguage}
              style={isDisabledInterchangeLanguage ? { 'opacity': "30%", 'cursor': 'not-allowed', 'pointerEvents': 'auto' } : {}}
              onClick={() => {
                interchangeLanguages()
              }}
            >
              <InterchangeIcon />
            </Button>
          </div>
        </Col>
        <Col>
          <Stack gap={2}>
            <LanguageSelector
              type={SectionType.To}
              value={toLanguage}
              onChange={setToLanguage} />

            <div style={{
              position: 'relative'
            }}>
              <TextArea
                type={SectionType.To}
                value={result}
                loading={loading}
                onChange={setResult}
              />
              <div style={{ position: 'absolute', left: 0, bottom: 0, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <Button
                  variant='link'
                  onClick={handleClipboard}>
                  <CopyIcon />
                </Button>
                <Button
                  variant='link'
                  onClick={handleSpeak}>
                  <SpeakerIcon />
                </Button>
              </div>

            </div>


          </Stack>
        </Col>
      </Row>
    </Container>
  )
}

export default App
