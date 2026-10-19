// name: Tiles
// by: Axolay
// version: 1.21

const credits = {
  version: 1.25,
  whatsnew: "added this specific block, added option for filter effects",
  list: "created by axolay"
}

const style = document.createElement('style')
style.textContent = `
  .tile {
    background-color: rgb(58, 58, 58);
    padding: 5px;
    width: 110px;
    height: fit-content;
    border-color: rgb(54, 54, 54);
    border-style: solid;
    border-width: 1px;
    margin: 5px;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    transition: .075s;
    color: white;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    user-drag: none;
  }

  .tile:hover {
    cursor: pointer;
  }

  .tilehovertoexpand {
    white-space: normal;
    display: absolute;
    }

  .tile:active {
    filter: brightness(.75);
    transition: 0s;
  }

  .thumb {
    width: 100%;
    aspect-ratio: 16/9;
    user-drag: none;
  }
  .title {
    font-size: 15px;
    color: white;
  }
  .desc {
    font-size: 10px;
  }
  #window {
    display: grid;
    grid-template-columns: repeat(auto-fill, 120px);
    align-content: start;
    align-content: flex-start;
    justify-content: flex-start;
  }

  ::-webkit-scrollbar {
    display: none;
  }
  .options {
    background-color: green;
  }
  .list {
    position: absolute;
    width: 200px;
    height: 200px;
  }
  .item {
    width: 100%;
    background-color: blue;
  }
  .titleDivider {
      font-size = '30px';
      font-weight = '50px';
      margin-left: 10px;

  }

  `
document.body.appendChild(style);



(function (Scratch) {
  'use strict';

      
  let clickedButtons = {}

  let mouse = {}

  let panel;

  addEventListener('pointerdown', (e) => {
    clickedButtons = {}
  })

  let scroll = 0;
  let scrolling = false;
  let mouseY = 0;
  let mousePos = {}

  addEventListener('mousemove', (mouse) => {
    mousePos = mouse;
    if(scrolling) {
      console.log(scroll + mouse.y)
      panel.scrollTop = scroll + mouseY
    }
  })

  addEventListener('mouseup', (e) => {
    scrolling = false
  })

  let max = {}


  // const bounds = Scratch.vm.renderer.getBounds();
  // max.w = bounds.width / 480;
  // max.h = bounds.height / 360;

  // max.ox = bounds.left;
  // max.oy = bounds.top;

  class MyExtension {
    getInfo() {
      return {
        id: 'tiles', // ID used in the URL, must be unique
        name: 'Tiles', // Display name
        color1: '#e93a3aff', // Block color
        color2: '#bb2d2dff', // Outline color
        color3: '#972222ff', // Text highlight color
        blocks: [
          {
            opcode: 'initialise',
            blockType: Scratch.BlockType.COMMAND,
            text: 'initialize x: [X] y: [Y] width: [WIDTH] height: [HEIGHT]',
            arguments: {
              X: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '0'
              },
              Y: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '0'
              },
              WIDTH: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '100%'
              },
              HEIGHT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '100%'
              },
            }
          },
          {
            opcode: 'addTile',
            blockType: Scratch.BlockType.COMMAND,
            text: 'add tile name: [TITLE] description: [DESC] thumbnail: [THUMB] id: [ID]',
            arguments: {
              TITLE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Tile'
              },
              DESC: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Descriptions are awesome'
              },
              THUMB: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'https://greedyallay.github.io/extensions/resources/dango.png'
              },
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'cat'
              },
              MENU: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '["cat", "dog"]'
              },
            }
          },
          {
            opcode: 'addTitle',
            blockType: Scratch.BlockType.COMMAND,
            text: 'add new title name: [NAME]',
            arguments: {
              NAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'new title'
              }
            }
          },
          {
            opcode: 'addButton',
            blockType: Scratch.BlockType.COMMAND,
            text: 'add new button id: [ID]',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'cat'
              }
            }
          },
          {
            opcode: 'addLine',
            blockType: Scratch.BlockType.COMMAND,
            text: 'add new text line to id: [ID] text: [TEXT] style: [CSS]',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'cat'
              },
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'cat'
              },
              CSS: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'font-size: 10px'
              }
            }
          },
          {
            opcode: 'removeTile',
            blockType: Scratch.BlockType.COMMAND,
            text: 'remove tile id: [ID]',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'cat'
              }
            }
          },
          {
            opcode: 'removeWindow',
            blockType: Scratch.BlockType.COMMAND,
            text: 'remove window',
          }, 
          
          // Styles

          {
            blockType: Scratch.BlockType.LABEL,
            text: 'Interaction'
          },
          //
          {
            opcode: 'getClicked',
            blockType: Scratch.BlockType.HAT,
            text: 'when card [NAME] clicked',
            arguments: {
              NAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'cat'
              }
            }
          },

          {
            opcode: 'getClicked1',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'when card [NAME] clicked',
            arguments: {
              NAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'cat'
              }
            }
          },
          {
            opcode: 'getClicked2',
            blockType: Scratch.BlockType.REPORTER,
            text: 'get current clicked card',
            arguments: {
              NAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'cat'
              }
            }
          },
          {
            opcode: 'getClicked3',
            blockType: Scratch.BlockType.HAT,
            text: 'when any card clicked',
            arguments: {
              NAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'cat'
              }
            }
          },

          // Styles

          {
            blockType: Scratch.BlockType.LABEL,
            text: 'Styles'
          },
          {
            opcode: 'setStylePX',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set [ELEMENT] [CSS] to [VALUE]px',
            arguments: {
              ELEMENT: {
                type: Scratch.ArgumentType.STRING,
                menu: 'elements'
              },
              VALUE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '10px'
              },
              CSS: {
                type: Scratch.ArgumentType.STRING,
                menu: 'csspx'
              }
            }
          },
          {
            opcode: 'setStyleColor', //the legacy one
            blockType: Scratch.BlockType.COMMAND,
            text: 'set [ELEMENT] [CSS] to [VALUE]',
            arguments: {
              ELEMENT: {
                type: Scratch.ArgumentType.STRING,
                menu: 'elements'
              },
              VALUE: {
                type: Scratch.ArgumentType.COLOR,
                defaultValue: '#b32b2b'
              },
              CSS: {
                type: Scratch.ArgumentType.STRING,
                menu: 'cssclr'
              }
            }
          },
          {
            opcode: 'setStyleNew',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set [ELEMENT] [CSS] to [VALUE]',
            arguments: {
              ELEMENT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '.tile'
              },
              VALUE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'value'
              },
              CSS: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'css'
              }
            }
          },
          {
            opcode: 'setEffect',
            blockType: Scratch.BlockType.COMMAND,
            text: 'apply [EFFECT] to [BACKFOREGROUND] of [ELEMENT] amount: [VALUE]',
            arguments: {
              BACKFOREGROUND: {
                type: Scratch.ArgumentType.STRING,
                menu: 'backforeground'
              },
              VALUE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '10px'
              },
              EFFECT: {
                type: Scratch.ArgumentType.STRING,
                menu: 'effects'
              },
              ELEMENT: {
                type: Scratch.ArgumentType.STRING,
                menu: 'elements',
                defaultValue: '#window'
              },
            }
          },
          {
            opcode: 'setThumb',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set thumb of id: [ID] to [THUMB]',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'cat'
              },
              THUMB: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: ''
              }
            }
          },
          {
            blockType: Scratch.BlockType.LABEL,
            text: 'Miscellaneous'
          },
          {
            opcode: 'credits',
            blockType: Scratch.BlockType.REPORTER,
            text: '[CREDITS]',
            arguments: {
              CREDITS: {
                type: Scratch.ArgumentType.STRING,
                menu: 'creditsMenu'
              }
            }
         },
          {
            opcode: 'run',
            blockType: Scratch.BlockType.COMMAND,
            text: 'run custom js [CODE]',
            arguments: {
              CODE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'alert("ok")'
              }
            }
         },

         {
            opcode: 'setMaxHeight',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set max card height: [HEIGHT] px',
            arguments: {
              WIDTH: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 'cat'
              },
              HEIGHT: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: '100'
              },
            }
          },
          {
            opcode: 'setStyle',
            blockType: Scratch.BlockType.COMMAND,
            text: ' (legacy) set [ELEMENT] [CSS] to [VALUE]',
            arguments: {
              ELEMENT: {
                type: Scratch.ArgumentType.STRING,
                menu: 'elements'
              },
              VALUE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'red'
              },
              CSS: {
                type: Scratch.ArgumentType.STRING,
                menu: 'css'
              }
            }
          },    
        ],
        menus: {
          elements: {
            acceptReporters: true,
            items: ['.tile', '.title','.thumb', '.titleDivider', '#window']
          },
          css: {
            acceptReporters: true,
            items: ['color', 'background-color','width', 'height', 'min-width', 'max-width', 'min-height', 'max-height', 'margin', 'margin-left', 'margin-right', 'margin-top', 'margin-bottom', 'background-image', 'border', 'border-radius', 'padding', 'animation-duration']            
          },
          csspx: {
            acceptReporters: true,
            items: ['width', 'height', 'min-width', 'max-width', 'min-height', 'max-height', 'margin', 'margin-left', 'margin-right', 'margin-top', 'margin-bottom', 'border-width', 'border-radius', 'padding', 'font-size', 'font-weight']            
          },
          cssclr: {
            acceptReporters: true,
            items: ['color', 'background-color', 'border-color', 'outline-color']            
          },
          properties: {
            acceptReporters: false,
            items: [' ']
            //items: ['show everything on hover', 'always full height']
          },
          creditsMenu: {
            acceptReporters: false,
            items: ['version', "what's new", 'credits']
            //items: ['show everything on hover', 'always full height']
          },
          backforeground: {
            acceptReporters: true,
            items: ['foreground', 'background']
          },
          effects: {
            acceptReporters: true,
            items: ['blur', 'brightness', 'contrast', 'grayscale', 'hue-rotate', 'invert', 'opacity', 'saturate', 'seopia']
          }
        }
      };
    }

    initialise({X, Y, WIDTH, HEIGHT}) {
      if(document.getElementById('window') == null) {
        panel = document.createElement("div")
        panel.style = `
        width: ${WIDTH};
        height: ${HEIGHT};
        background-color: #00000041;
        display: flex;
        flex-wrap: wrap;
        overflow-y: scroll;
        position: absolute;
        left: ${X}px;
        top: ${Y}px
        `
        panel.style.pointerEvents = 'auto';
        panel.id = 'window'
        Scratch.renderer.addOverlay(panel, "scale")

        panel.addEventListener("mousedown", () => {
          scroll = panel.scrollTop
          scrolling = true;
          mouseY = mousePos.y;
          console.log("i love diddy but he doesnt love me")
        })
      }
    }

    addTile({TITLE, DESC, THUMB, ID, MENU}) {
      const card = document.createElement('div')
      const title = document.createElement('span')
      const desc = document.createElement('span')
      const thumb = document.createElement('img')
      const options = document.createElement('div')
      // const menu = JSON.parse(MENU)

      if(THUMB == '') {
        thumb.src = 'https://greedyallay.github.io/extensions/resources/IMG_5205.jpg'
            } else {
        thumb.src = THUMB
      }
      thumb.id = `${ID}-thumb`
      
      desc.textContent = DESC
      title.textContent = TITLE
      // options.textContent = '...'

      title.className = 'title'
      card.className = 'tile'
      desc.className = 'desc'
      thumb.className = 'thumb'
      // options.className = 'options'

      card.id = `card${ID}`

      card.appendChild(thumb)
      card.appendChild(title)
      card.appendChild(desc)
      // card.appendChild(options)

      card.addEventListener('click', () => {
        clickedButtons[ID] = true
      })

      options.addEventListener('click' , () => {
        const list = document.createElement('div')
        list.className = 'list'

        for(let i = 0; i < menu.length; i++) {
          const item = document.createElement('div')
          item.textContent = menu[i]
          item.className = 'item'
          
          list.appendChild(item)
        }
        list.style.left = mouse.x-400+'px'
        list.style.top = mouse.y-200+'px'

        // list.style.left = ((mouse.x - max.ox) / max.w) + 'px';
        // list.style.top  = ((mouse.y - max.oy) / max.h) + 'px';
        console.log(mouse.x+mouse.y)
      Scratch.renderer.addOverlay(list, "scale")
      })
      document.getElementById('window').appendChild(card)
    }

    removeWindow() {
      const window = document.getElementById('window')
      if(window) {
      clickedButtons = {}
      window.remove()
      }

    }

    setStyleNew(args) {
      this.setStyle(args)
    }

    setStylePX(args) {
      this.setStyle(args)
    }
    setStyleColor(args) {
      this.setStyle(args)
    }

    setEffect({BACKFOREGROUND, EFFECT, VALUE, ELEMENT}) { //ugh i dont wanna do ts
      if(BACKFOREGROUND === "foreground") {
        document.querySelectorAll(ELEMENT).forEach(el => {
            el.style.filter = `${EFFECT}(${VALUE})`
        })
      } else {
        document.querySelectorAll(ELEMENT).forEach(el => {
            el.style.backdropFilter = `${EFFECT}(${VALUE})`
        })
      }
    }

    setStyle({ELEMENT, VALUE, CSS}) {
      document.querySelectorAll(ELEMENT).forEach(el => {
          el.style[CSS] = VALUE
      })
    }

    removeTile({ID}) {
      const element = document.getElementById(`card${ID}`)
      if(element) { element.remove() }
    }

    getClicked({NAME}) {
      if(NAME !== '') { if(clickedButtons[NAME]) { return clickedButtons[NAME] } }
    }
    getClicked1({NAME}) {
      if(NAME !== '') { if(clickedButtons[NAME]) { return clickedButtons[NAME] } }
    }
    getClicked2({NAME}) {
      if (NAME !== '') { return Object.keys(clickedButtons).find(key => clickedButtons[key]) || ''; }
    }

    getClicked3({NAME}) {
      if (NAME !== '') { return Object.keys(clickedButtons).some(key => clickedButtons[key]);
      }
    }
    
    addTitle({NAME}) {
      const title = document.createElement('span')
      const hr = document.createElement('hr')
      const br = document.createElement('br')
      const container = document.createElement('div')
      title.className = 'titleDivider'
      title.textContent = NAME
      const window = document.getElementById('window')
      container.style.display = 'block'
      container.style.width = '100%'
      container.appendChild(br)
      container.appendChild(title)
      container.appendChild(hr)
      window.appendChild(container)
      
    }

    //setMaxHeight({HEIGHT}) {
    //  const tiles = document.getElementsByClassName("tile")
    //  for(let i = 0; i < tiles.length; i++) { tiles[i].style = `max-height: ${HEIGHT}px` }
    //}

    addLine({ID, TEXT, CSS}) {
      const card = document.getElementById(`card${ID}`)
      const el = document.createElement('span')
      el.textContent = TEXT
      el.style = CSS
      if(card) { card.appendChild(el) }
      
    }
//WHY IS THIS SHIT NOT JUST WORKING AHHHH
    property({PROPERTY, VALUE}) {
      switch (PROPERTY) {
        case 'show everything on hover':
          if(VALUE == 'true') {
            style.textContent += '.tile:hover { cursor: pointer; filter: brightness(1.25); white-space: normal; display: absolute;}'
            alert(style)
          } else {
            style.textContent = style.textContent.replaceAll('.tile:hover', '.disabled:hover')
            alert(style)
          }
      }
    }

    setThumb({ID, THUMB}) {
      const thumb = document.getElementById(`${ID}-thumb`)
      thumb.src = THUMB
    }

    credits({CREDITS}) {
      switch(CREDITS) {
        case 'version': {
          return credits.version
        }
        case "what's new": {
          return credits.whatsnew
        }
        case "credits": {
          return credits.list
        }
      }
      return CREDITS
    }

    run({CODE}) {
      eval(CODE)
    }
  }
  Scratch.extensions.register(new MyExtension());
})(Scratch);
