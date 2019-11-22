import { Card } from '@fusuma/client';

<!-- note
This is my first conference talk in English!
I'm a little nervous...

So I'm using a custom renderer to introduce myself.

(yarn voice)
-->

<Card
    right={<img src="../images/self.jpg" />}
    left={
        <>
            <h3>Toru Kobayashi</h3>
            <ul>
                <li　className="self-introduction"> @koba04 <br /><a href="https://twitter.com/koba04">Twitter</a> / <a href="https://github.com/koba04">GitHub</a></li>
                <li className="self-introduction">Web Developer<br />2007〜</li>
                <li className="self-introduction">Cybozu<br />→Frontend Expert Team</li>
                <li className="self-introduction">SmartHR<br />→Frontend Advisor</li>
            </ul>
        </>
  }
/>

----------------------

<!-- note
This is the actual code of the demo using a custom renderer that I've created.
After this talk, you can create a custom renderer like this.
-->

```js
ReactVoice.render(
  <>
    <kyoko>こんにちは</kyoko>
    <alex>
        I work as a frontend developer for Cybozu and
        I work as a frontend advisor for SmartHR.
    </alex>
    <alex>My Twitter and GitHub accounts are @koba04</alex>
    <victoria>
        I'm also one of the organizers of React.js meetup in Tokyo and
        a contributor of React.
    </victoria>
    <victoria>I've been working with React for 5years.</victoria>
  </>,
  {}
);
```
