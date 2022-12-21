const css = String.raw
const html = String.raw
const stylesheet = new CSSStyleSheet()
stylesheet.replaceSync(css`
  div {
    display: grid;
    grid-template-rows: repeat(var(--rows), 1fr);
    grid-template-columns: repeat(var(--cols), 1fr);
    gap: 0.5em;
  }
  /*div button[aria-pressed="false"] {
    background: silver;
  }*/
  div button[aria-pressed="true"] {
    color-scheme: dark;
  }
`)
/**
 * An example Custom Element. This documentation ends up in the
 * README so describe how this elements works here.
 *
 * You can event add examples on the element is used with Markdown.
 *
 * ```
 * <music-sampler></music-sampler>
 * ```
 */
class MusicSamplerElement extends HTMLElement {
  #renderRoot!: ShadowRoot

  #step = 0
  #beatCount = 8
  #stylesheet = new CSSStyleSheet()
  #timerId = 0

  connectedCallback(): void {
    this.#renderRoot = this.attachShadow({mode: 'open'})
    this.#renderRoot.adoptedStyleSheets.push(stylesheet, this.#stylesheet)
    this.#renderRoot.innerHTML = html`<slot></slot>
      <div></div>
      <footer>
        <button id="play">Play</button>
        <button id="stop">Stop</button>
      </footer>`
    this.#renderRoot.addEventListener('slotchange', event => {
      this.#createSampler(event.target.assignedElements().length)
    })
    this.#renderRoot.addEventListener('click', this)
  }

  handleEvent(event: Event) {
    const {target} = event
    console.log(target)
    if (event.type === 'click' && target?.id === 'play') {
      this.play()
    } else if (event.type === 'click' && target?.id === 'stop') {
      this.stop()
    } else if (event.type === 'click' && target instanceof HTMLButtonElement) {
      console.log('target is button', target)
      const newValue = target.getAttribute('aria-pressed') !== 'true'
      target.setAttribute('aria-pressed', `${newValue}`)
      target.textContent = newValue ? '✓' : '✕'
      this.#playAudio(target)
    }
  }

  play() {
    this.#step = 0
    this.#tick()
  }

  #tick() {
    console.log('tick!')
    this.#timerId = setTimeout(() => this.#tick(), 100)
    const active = this.#renderRoot.querySelectorAll(`button[col="${this.#step}"][aria-pressed="true"]`)
    for (const button of active) {
      this.#playAudio(button)
    }
    this.#step += 1
    if (this.#step >= this.#beatCount) this.#step = 0
  }

  #playAudio(button: HTMLButtonElement) {
    const slot = this.#renderRoot.querySelector('slot')!
    const row = Number(button.getAttribute('row'))
    const audio = slot.assignedElements()[row]
    console.log(`attempting to play row ${row}`, audio)
    audio.play()
  }

  stop() {
    clearTimeout(this.#timerId)
  }

  #createSampler(length: number) {
    this.#stylesheet.replaceSync(css`
      :host {
        --rows: ${length};
        --cols: ${this.#beatCount};
      }
    `)
    const container = this.#renderRoot.querySelector('div')!
    for (let i = 0; i < length; i += 1) {
      for (let j = 0; j < this.#beatCount; j += 1) {
        const button = document.createElement('button')
        button.innerHTML = '✕'
        button.setAttribute('aria-pressed', 'false')
        button.setAttribute('row', i)
        button.setAttribute('col', j)
        container.append(button)
      }
    }
  }
}

declare global {
  interface Window {
    MusicSamplerElement: typeof MusicSamplerElement
  }
}

export default MusicSamplerElement

if (!window.customElements.get('music-sampler')) {
  window.MusicSamplerElement = MusicSamplerElement
  window.customElements.define('music-sampler', MusicSamplerElement)
}
