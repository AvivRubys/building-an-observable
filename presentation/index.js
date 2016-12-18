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

function getDOMPrintingObserver(element) {
  return {
    next(data) {
        appendLine(element, data);
    },
    error(error) {
        appendLine(element, error);
    },
    complete() {
        appendLine(element, "Done!");
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
            <Heading size={1} fit caps textColor="rx">
               Understanding how Rx works by reimplementation
            </Heading>
            <Text textColor="secondary" textSize="1.5em" margin="20px 0px 0px" bold>aviv@soluto.com</Text>
          </Slide>
          <Slide transition={["slide"]}>
            <Heading size={2} caps textColor="secondary" textFont="primary">
              About me
            </Heading>
            <List>
              <ListItem>Software Engineer at Soluto 💻</ListItem>
              <Appear><ListItem>Interested in music 🎵, technology 💾, and I'd like to learn how to knit one day 💈</ListItem></Appear>
              <Appear><ListItem>Currently playing way too much Overwatch 🎮</ListItem></Appear>
              <Appear><ListItem>...Recently discovered emojis</ListItem></Appear>
            </List>
          </Slide>
          <Slide notes="What's the basic unit of operation in Rx?">
            <Heading caps textColor="secondary" textFont="primary">
              <strike>Observables</strike>
            </Heading><br/>
            <Appear>
              <Heading caps textColor="secondary" textFont="primary">
                <strike>Observers</strike>
              </Heading>
            </Appear><br/>
            <Appear>
              <Heading caps fit textColor="secondary" textFont="primary">
                Callbacks
              </Heading>
            </Appear>
          </Slide>
          <Slide transition={["zoom", "fade"]} bgColor="primary" notes="Everyone's first callback">
              <div>
                <Heading size={6} textColor="secondary">Our first callbacks</Heading>
                <Runner code={require("raw!../assets/callbacks-introduction/simple-callbacks.js.asset").split("###")} maxLines={8}
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
            <Text size={1} textColor="secondary" >
                Extracting a general interface for callbacks
             </Text>
             <Text textColor="secondary">
                Requires three handlers:
             </Text>
             <Appear>
              <List>
                <ListItem>Next piece of data</ListItem>
                <ListItem>Processing error</ListItem>
                <ListItem>EOF</ListItem>
              </List>
             </Appear>
          </Slide>
          <Slide transition={["slide"]} bgDarken={0.75} notes="Change getSomeData to subscribe">
            <Runner code={require("raw!../assets/callbacks-introduction/generalizing.js.asset").split("###")} maxLines={18}
              imports={{
                fetch: () => new Promise((resolve) => setTimeout(() => resolve("Hello 🐣"), 1000)),
                getPrintingObserver
              }}>
              <ConsoleOutput />
            </Runner>
          </Slide>
          <Slide transition={["slide"]} bgDarken={0.75} notes="Even though the Observable is running the show, the Observer's api dictates everything">
            <Heading caps size={2} textColor="secondary">
                Conclusions
             </Heading>
             <List>
              <ListItem>Observer = Callback handler</ListItem>
              <ListItem>Observable = Data provider to an observer</ListItem>
             </List>
          </Slide>
          <Slide transition={["zoom", "fade"]} bgColor="primary">
            <Heading caps>What did we lose?</Heading>
            <List>
              <ListItem>Collection tools<br/>
                <List>
                  <ListItem>&nbsp;&nbsp;Map</ListItem>
                  <ListItem>&nbsp;&nbsp;Filter</ListItem>
                  <ListItem>&nbsp;&nbsp;ForEach</ListItem>
                </List>
              </ListItem>
            </List>
          </Slide>
          <Slide transition={["zoom", "fade"]} bgColor="primary" notes="We lost utility we used to have, so let's see how we use collection operators on observables">
            <Heading size={4} textColor="secondary" caps>Collection operators</Heading>
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
            <Heading caps size={2} textColor="secondary">
                Operators as pure functions
             </Heading>
             <List>
              <Appear><ListItem>TakeN/SkipN</ListItem></Appear>
              <Appear><ListItem>Combining observables</ListItem></Appear>
              <Appear><ListItem>FlatMap</ListItem></Appear>
             </List>
          </Slide>
          <Slide transition={["zoom", "fade"]} bgColor="primary">
            <Heading caps fit>Questions</Heading>
          </Slide>
        </Deck>
      </Spectacle>
    );
  }
}

