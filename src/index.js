import overunder from 'overunder'

let resizer1 = overunder.resize(700, document.getElementById('resizer1'))
let resizer2 = overunder.resize(500, document.getElementById('resizer2'))

let resizer = overunder.resize(1000)
let scroller = overunder.scroll(800)

resizer1.on('under', (el) => {
  el.classList.remove('is-over')
})
resizer1.on('over', (el) => {
  el.classList.add('is-over')
})

resizer2.on('under', (el) => {
  el.classList.remove('is-over')
})
resizer2.on('over', (el) => {
  el.classList.add('is-over')
})

resizer1.init().update()
resizer2.init().update()

let resizeView = document.querySelector('.resizer')

resizer.on('under', () => {
  resizeView.innerHTML = 'Resize: under 1000px'
})
resizer.on('over', () => {
  resizeView.innerHTML = 'Resize: over 1000px'
})

let scrollView = document.querySelector('.scroller')

scroller.on('under', () => {
  scrollView.innerHTML = 'Scroll: under 800px'
})
scroller.on('over', () => {
  scrollView.innerHTML = 'Scroll: over 800px'
})

resizer.init().update()
scroller.init().update()
