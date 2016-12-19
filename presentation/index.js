// Import React
import React, {Component} from "react";
import Runner from "./helpers/Runner";
import ConsoleOutput from "./helpers/outputs/Console";
import DomOutput from "./helpers/outputs/Dom";
import ReactDOM from "react-dom";
import "rx-dom";
require("./index.css");

// Import Spectacle Core tags
import {
  Appear,
  BlockQuote,
  Cite,
  CodePane,
  Deck,
  Fill,
  Heading,
  Image,
  Layout,
  Link,
  ListItem,
  List,
  Markdown,
  Quote,
  Slide,
  Spectacle,
  Text
} from "spectacle";

// Import image preloader util
import preloader from "spectacle/lib/utils/preloader";

// Require CSS
require("normalize.css");
require("spectacle/lib/themes/default/index.css");

import {theme} from 'spectacle-theme-solarized-dark';

function appendLine(element, line) {
  element.textContent = line + "\n" + element.textContent;
}

function getPrintingObserver(context) {
  return {
    next(data) {
        context.log("Next: " + data)
    },
    error(error) {
        context.error(error)
    },
    complete() {
        context.log("Done!")
    }
  }
}

function createObservable(subscribe) {
  return {
    subscribe,
    map: mapOperator,
    filter: filterOperator
  }
}

function mapOperator(transformFn) {
  let inputObservable = this;
  let outputObservable = createObservable(
    function (outputObserver) {
      inputObservable.subscribe({
        next: function (x) {
          const y = transformFn(x)
          outputObserver.next(y)
        },
        error: outputObserver.error,
        complete: outputObserver.complete
      })
    }
  )

  return outputObservable;
}

function filterOperator(predicateFn) {
  let inputObservable = this;
  let outputObservable = createObservable(
    function (outputObserver) {
      inputObservable.subscribe({
        next: function (x) {
          if (predicateFn(x)) {
            outputObserver.next(x)
          }
        },
        error: outputObserver.error,
        complete: outputObserver.complete
      })
    }
  )

  return outputObservable;
}

export default class Presentation extends React.Component {
  render() {
    return (
      <Spectacle theme={theme}>
        <Deck transition={["zoom", "slide"]} transitionDuration={500}>
          <Slide transition={["zoom"]}>
            <Heading size={10} fit caps lineHeight={1} textColor="rx">
              Building your own Observable
            </Heading>
            <Heading size={1} fit caps>
               Understanding how Rx works by reimplementation
            </Heading>
            <Text caps>Aviv Rozenboim</Text>
          </Slide>
          <Slide transition={["slide"]}>
            <Heading caps>
              About me
            </Heading>
            <Appear>
              <Text size={2} caps textColor="quartenary" textFont="primary" textsize={50}>
                @AvivRubys (GitHub, Twitter)<br/>
                aviv@soluto.com (Mail)<br/>
                Aviv Rozenboim (Life)
              </Text>
            </Appear>
            <Appear>
              <List>
                <ListItem textSize={30}>Software Engineer at Soluto 💻</ListItem>
                <Appear><ListItem textSize={30}>Interested in music 🎵, technology 💾 & stuff 🗺</ListItem></Appear>
                <Appear><ListItem textSize={30}>Playing way too much Overwatch 🎮</ListItem></Appear>
                <Appear><ListItem textSize={30}>...Recently discovered emoji 🍯 🙅 👾 👘</ListItem></Appear>
              </List>
            </Appear>
          </Slide>
          <Slide notes="Who has experience with these things?">
            <Heading fit caps>Testing the crowd</Heading>
            <List>
              <ListItem>Any version of Rx</ListItem>
              <Appear><ListItem>Javascript</ListItem></Appear>
              <Appear><ListItem>RxJS</ListItem></Appear>
            </List>
          </Slide>
          <Slide>
            <Heading caps>Agenda</Heading>
            <List>
              <ListItem>Processing data with observers</ListItem>
              <ListItem>Operators</ListItem>
              <ListItem>Subscribe chain</ListItem>
            </List>
          </Slide>
          <Slide notes="Observables are defined by observers, which are defined by callbacks">
            <Heading fit>Basic logical unit</Heading>
            <Appear>
              <Heading caps textColor="secondary" textFont="primary">
                <strike>Observables</strike>
              </Heading>
            </Appear>
            <Appear>
              <Heading caps textColor="secondary" textFont="primary">
                <strike>Observers</strike>
              </Heading>
            </Appear>
            <Appear>
              <Heading caps fit textColor="secondary" textFont="primary">
                Callbacks
              </Heading>
            </Appear>
          </Slide>
          <Slide transition={["zoom", "fade"]} bgColor="primary" notes="Mention fetch is a promise">
            <div>
              <Heading fit>Our first callbacks</Heading>
              <Runner code={require("raw!../assets/callbacks-introduction/simple-callbacks.js.asset").split("###")} maxLines={9}
                imports={{
                  getButton: ({elems: {documentCallbackButton}}) => documentCallbackButton,
                  appendLine: ({elems: {documentCallbackOutput}}, line) => appendLine(documentCallbackOutput, line)
                }}>
                <DomOutput>
                  <button id="documentCallbackButton">Click me</button>
                  <pre style={{maxHeight: 200, overflow: "auto"}} id="documentCallbackOutput"></pre>
                </DomOutput>
              </Runner>
            </div>
          </Slide>
          <Slide transition={["slide"]} bgDarken={0.75}>
            <Heading textSize={60} fit>
                General data interface
            </Heading>
            <Appear>
            <List>
              <ListItem>Next piece of data</ListItem>
              <ListItem>Processing error</ListItem>
              <ListItem>EOF</ListItem>
            </List>
            </Appear>
          </Slide>
          <Slide transition={["slide"]} bgDarken={0.75} notes="Introduce sequentially. Change getSomeData to subscribe. Callbacks don't mean working asynchronously.">
            <Runner code={require("raw!../assets/callbacks-introduction/generalizing.js.asset").split("###")} maxLines={18}
              imports={{
                fetch: () => new Promise((resolve) => setTimeout(() => resolve("Hello 🐣"), 1500)),
                getPrintingObserver
              }}>
              <ConsoleOutput />
            </Runner>
          </Slide>
          <Slide transition={["zoom", "fade"]} bgColor="primary" notes="This is why Rx is used a lot on backend programming - implementation can be sync, async, streaming, and it still works">
            <Heading caps>Pros</Heading>
            <Appear>
              <List>
                <ListItem>Common abstraction for any sync &nbsp; or async operation</ListItem>
                <ListItem>Abstraction hides the source</ListItem>
              </List>
            </Appear>
          </Slide>
          <Slide transition={["zoom", "fade"]} bgColor="primary" notes="Cons of this naive rx implementation, not of rx itself.">
            <Heading caps>Cons</Heading>
            <Appear>
              <List>
                <ListItem>Collection tools<br/>
                  <List>
                    <ListItem>&nbsp;&nbsp;Map</ListItem>
                    <ListItem>&nbsp;&nbsp;Filter</ListItem>
                    <ListItem>&nbsp;&nbsp;ForEach</ListItem>
                  </List>
                </ListItem>
              </List>
            </Appear>
          </Slide>
          <Slide transition={["zoom", "fade"]} bgColor="primary" notes="We lost utility we used to have, so let's see how we use collection operators on observables">
            <Heading fit caps>Collection operators</Heading>
            <Runner maxLines={10} code={require("raw!../assets/operators/collection.js.asset").split("###")}>
              <ConsoleOutput />
           </Runner>
          </Slide>
          <Slide transition={["zoom", "fade"]} bgColor="primary">
            <Heading size={4} textColor="secondary" caps>Operators</Heading>
            <Runner maxLines={18} code={require("raw!../assets/operators/basic.js.asset").split("###")}
              imports={{
                getPrintingObserver,
                mapOperator,
                filterOperator,
                createObservable: (subscribe) => ({subscribe, map: mapOperator, filter: filterOperator})
              }}>
              <ConsoleOutput />
           </Runner>
          </Slide>
          <Slide transition={["slide"]}>
            <Heading fit>Operators</Heading>
             <List>
              <ListItem>TakeN/SkipN</ListItem>
              <ListItem>Combining observables</ListItem>
              <ListItem>Flattening observables</ListItem>
              <ListItem>And many more</ListItem>
             </List>
          </Slide>
          <Slide transition={["zoom", "fade"]} bgColor="primary">
            <Heading caps fit>Questions? 🤔</Heading>
          </Slide>
        </Deck>
      </Spectacle>
    );
  }
}

