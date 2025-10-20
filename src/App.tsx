import type { Component } from 'solid-js';
import styles from './App.module.css';
import { createSignal } from 'solid-js';

import * as toxicity from '@tensorflow-models/toxicity';

const App: Component = () => {
  const okayMessages = [
    'Hard to say, probably okay.',
    "I don't know, whatever.",
    'Your guess is as good as mine, probably fine.',
    'My friend said this to me once, so likely all good.',
    "I read this in Forbes, so it's fine.",
  ];

  const warningMesages = [
    'Nastiness detected',
    'That might be bad',
    'Filth',
    'Someone needs therapy',
    'Woah! Time out!',
    'Eeek! No!',
  ];

  const [data, setData] = createSignal('');
  const [output, setOutput] = createSignal('---');
  const [buttonText, setButtonText] = createSignal('Loading..');
  const [running, setRunning] = createSignal(true);
  const threshold = 0.0;
  const handleInput = (event: { currentTarget: { value: string } }) => {
    setData(event.currentTarget.value);
  };

  const getOkayMessage = () => {
    return getMessage(okayMessages);
  };

  const getWarningMessage = () => {
    return getMessage(warningMesages);
  };

  const getMessage = (dataSource: string[]) => {
    const idx = Math.floor(Math.random() * dataSource.length);
    return dataSource[idx];
  };

  let theModel: toxicity.ToxicityClassifier;
  toxicity.load(threshold, []).then((model) => {
    theModel = model;
    setRunning(false);
    setButtonText('Find out');
  }).catch (() => {
    setRunning(true);
    setOutput('Model cannot be loaded.');
  });
  const runModel = () => {
    setButtonText('Processing...');
    setRunning(true);
    setOutput('---');
    theModel
      .classify([data()])
      .then((predictions) => {
        setTimeout(() => {
          const categories = predictions
            .filter((f) => f.results[0].match)
            .map((i) => i.label);
          if (!categories.length) {
            setOutput(getOkayMessage());
          } else {
            const insult = !!categories.find((f) => f === 'insult');
            const insultText = insult
              ? '--very insulting!'
              : '--but not technically an insult.';
            setOutput(getWarningMessage() + insultText);
          }
          setButtonText('Find out');
          setRunning(false);
        }, 500);
      })
      .catch((err) => {
        setOutput(`error ${err}`);
      });
  };

  return (
    <div class={styles.App}>
      <header class={styles.header}>
        <h1>Did someone insult me?</h1>
        <h3>What did they say?</h3>
        <textarea
          class="largetext"
          value={data()}
          onInput={handleInput}
          rows="5"
          cols="30"
        ></textarea>
        <button disabled={running()} onClick={runModel}>
          {buttonText()}
        </button>
        <h3>The verdict?</h3> <span>{output()}</span>
      </header>
      <div class="left-annotate">
        <a href="https://github.com/smycynek/is-it-an-insult">
          https://github.com/smycynek/is-it-an-insult
        </a>
      </div>

    </div>
  );
};

export default App;
