const RegisterPPU = {
    Controller: 'Controller',
    Mask: 'Mask',
    Status: 'Status',
    OAMAddress: 'OAMAddress',
    OAMData: 'OAMData',
    Scroll: 'Scroll',
    Address: 'Address',
    Data: 'Data',
    DirectMemoryAccess: 'DirectMemoryAccess',
}
const registerPPUAddress = {
    [RegisterPPU.Controller]: 0x2000,
    [RegisterPPU.Mask]: 0x2001,
    [RegisterPPU.Status]: 0x2002,
    [RegisterPPU.OAMAddress]: 0x2003,
    [RegisterPPU.OAMData]: 0x2004,
    [RegisterPPU.Scroll]: 0x2005,
    [RegisterPPU.Address]: 0x2006,
    [RegisterPPU.Data]: 0x2007,
    [RegisterPPU.DirectMemoryAccess]: 0x4014,
}

const colorMap = {
    0: '#000000',
    1: '#ffffff',
    2: '#880000',
    3: '#aaffee',
    4: '#cc44cc',
    5: '#00cc55',
    6: '#0000aa',
    7: '#eeee77',
    8: '#dd8855',
    9: '#664400',
    10: '#ff7777',
    11: '#333333',
    12: '#777777',
    13: '#aaff66',
    14: '#0088ff',
    16: '#bbbbbb',
}

const palettes = [
    [84, 84, 84], [0, 30, 116], [8, 16, 144], [48, 0, 136], [68, 0, 100], [92, 0, 48], [84, 4, 0], [60, 24, 0], [32, 42, 0], [8, 58, 0], [0, 64, 0], [0, 60, 0], [0, 50, 60], [0, 0, 0],
    [152, 150, 152], [8, 76, 196], [48, 50, 236], [92, 30, 228], [136, 20, 176], [160, 20, 100], [152, 34, 32], [120, 60, 0], [84, 90, 0], [40, 114, 0], [8, 124, 0], [0, 118, 40], [0, 102, 120], [0, 0, 0],
    [236, 238, 236], [76, 154, 236], [120, 124, 236], [176, 98, 236], [228, 84, 236], [236, 88, 180], [236, 106, 100], [212, 136, 32], [160, 170, 0], [116, 196, 0], [76, 208, 32], [56, 204, 108], [56, 180, 204], [60, 60, 60],
    [236, 238, 236], [168, 204, 236], [188, 188, 236], [212, 178, 236], [236, 174, 236], [236, 174, 212], [236, 180, 176], [228, 196, 144], [204, 210, 120], [180, 222, 120], [168, 226, 144], [152, 226, 180], [160, 214, 228], [160, 162, 160],
]
const palettesColor = [
    'rgb(84, 84, 84)',
    'rgb(0, 30, 116)',
    'rgb(8, 16, 144)',
    'rgb(48, 0, 136)',
    'rgb(68, 0, 100)',
    'rgb(92, 0, 48)',
    'rgb(84, 4, 0)',
    'rgb(60, 24, 0)',
    'rgb(32, 42, 0)',
    'rgb(8, 58, 0)',
    'rgb(0, 64, 0)',
    'rgb(0, 60, 0)',
    'rgb(0, 50, 60)',
    'rgb(0, 0, 0)',
    'rgb(152, 150, 152)',
    'rgb(8, 76, 196)',
    'rgb(48, 50, 236)',
    'rgb(92, 30, 228)',
    'rgb(136, 20, 176)',
    'rgb(160, 20, 100)',
    'rgb(152, 34, 32)',
    'rgb(120, 60, 0)',
    'rgb(84, 90, 0)',
    'rgb(40, 114, 0)',
    'rgb(8, 124, 0)',
    'rgb(0, 118, 40)',
    'rgb(0, 102, 120)',
    'rgb(0, 0, 0)',
    'rgb(236, 238, 236)',
    'rgb(76, 154, 236)',
    'rgb(120, 124, 236)',
    'rgb(176, 98, 236)',
    'rgb(228, 84, 236)',
    'rgb(236, 88, 180)',
    'rgb(236, 106, 100)',
    'rgb(212, 136, 32)',
    'rgb(160, 170, 0)',
    'rgb(116, 196, 0)',
    'rgb(76, 208, 32)',
    'rgb(56, 204, 108)',
    'rgb(56, 180, 204)',
    'rgb(60, 60, 60)',
    'rgb(236, 238, 236)',
    'rgb(168, 204, 236)',
    'rgb(188, 188, 236)',
    'rgb(212, 178, 236)',
    'rgb(236, 174, 236)',
    'rgb(236, 174, 212)',
    'rgb(236, 180, 176)',
    'rgb(228, 196, 144)',
    'rgb(204, 210, 120)',
    'rgb(180, 222, 120)',
    'rgb(168, 226, 144)',
    'rgb(152, 226, 180)',
    'rgb(160, 214, 228)',
    'rgb(160, 162, 160)',
]


class PPU {
    /**
     * @param { DataBus } dataBus - DataBus实例
     */
    constructor(dataBus) {
        this.dataBus = dataBus
        this.init()
    }

    static new(...args) {
        let i = new this(...args)
        return i
    }

    init() {
        // 内存大小
        this.memory = []
        this.memory = new Array(1024 * 64) // 64KB

        // memory map
        this.indexPatternTables = 0x0000
        this.sizeOfPatternTables = 0x2000
        this.indexNameTables = 0x2000
        this.indexPalettes = 0x3F00
        this.indexMirrors = 0x4000
        // palettes memory map
        this.indexUniversalBackgroundColor = 0x3F00
        this.indexBackgroundPalette0 = 0x3F01
        this.indexBackgroundPalette1 = 0x3F05
        this.indexBackgroundPalette2 = 0x3F09
        this.indexBackgroundPalette3 = 0x3F0D
        this.indexSpritePalette0 = 0x3F11
        this.indexSpritePalette1 = 0x3F15
        this.indexSpritePalette2 = 0x3F19
        this.indexSpritePalette3 = 0x3F1D

        // 初始化屏幕
        const canvas = document.querySelector('#id-canvas');
        this.canvas = canvas.getContext('2d');

        // 屏幕大小
        this.screenWith = 256
        this.screenHeight = 240
        // 一个像素点在canvas里的尺寸
        this.sizeOfPixel = 2
        this.sizeOfTile = 8

        // 初始化寄存器
        this.register = {
            [RegisterPPU.Controller]: 0x00,
            [RegisterPPU.Mask]: 0x00,
            [RegisterPPU.Status]: 0x00,
            [RegisterPPU.OAMAddress]: 0x00,
            [RegisterPPU.OAMData]: 0x00,
            [RegisterPPU.Scroll]: 0x00,
            [RegisterPPU.Address]: 0x00,
            [RegisterPPU.Data]: 0x00,
            [RegisterPPU.DirectMemoryAccess]: 0x00,
        }

        this.setPixel = this.setPixel.bind(this)
        this.render = this.render.bind(this)
    }

    loadCHRROM(rom) {
        let d = rom
        if (rom.length < this.sizeOfPatternTables) {
            d = rom.slice(0, this.sizeOfPatternTables)
        }
        this.dataBus.setMemoryBlockPPU(this.indexPatternTables, d)
    }

    getPatternTables() {
        let data = []
        let tileAmount = this.sizeOfPatternTables / 16
        for (let i = 0; i < tileAmount; i++) {
            let addressStart = i * 16
            let addressEnd = addressStart + 15
            let tileData = this.dataBus.getMemoryBlockPPU(addressStart, addressEnd)
            let tileColor = this.getTileColor(tileData)
            data.push(tileColor)
        }
        log(data)

        let columAmount = this.screenWith / 8
        let rowAmount = this.screenHeight / 8
        for (let i = 0; i < rowAmount; i++) {
            for (let j = 0; j < columAmount; j++) {
                // log(`row: <${i}>`, `colum: <${j}>` )
                let n = i * columAmount + j
                if (n >= 512) {
                    break
                } else {
                    let tile = data[n]
                    log('<p>', `<${i}>`, `<${j}>`, n)
                    this.renderTile(j, i, tile)
                }
            }
        }
    }

    renderTile(baseX, baseY, colorArray) {
        for (let ii = 0; ii < 8; ii++) {
            for (let jj = 0; jj < 8; jj ++) {
                let n = ii * 8 + jj

                let color = colorArray[n]
                let x = (baseX * 8) + (7 - jj)
                let y = baseY * 8 + ii

                this.setPixel(x, y, color)
            }
        }
    }

    getTileColor(tileData) {
        let data = []
        for (let i = 0; i < 8; i++) {
            let lowByte = tileData[i]
            let highByte = tileData[i + 8]
            for (let j = 0; j < 8; j++) {
                let lowBit = getBitFromByte(lowByte, j)
                let highBit = getBitFromByte(highByte, j)
                let colorIndex = (highBit << 1) + lowBit

                // let color = palettes[colorIndex]

                const map = {
                    0: palettes[1],
                    1: palettes[23],
                    2: palettes[27],
                    3: palettes[30],
                }
                let color = map[colorIndex]

                data.push(color)
            }
        }

        return data
    }

    setPixel(x, y, color) {
        let x1 = x * this.sizeOfPixel
        let y1 = y * this.sizeOfPixel
        // this.canvas.fillStyle = color
        this.canvas.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`
        this.canvas.fillRect(x1, y1, this.sizeOfPixel, this.sizeOfPixel);
    }

    render(component) {
        let data = component.getScreen()

        let x = 0
        let y = 0
        let color = 0
        for (let i = 0; i < this.screenWith; i++) {
            for (let j = 0; j < this.screenHeight; j++) {
                let n = i * this.screenWith + j
                color = data[n] || 0
                x = j
                y = i
                this.setPixel(x, y, color)
            }
        }
    }

    renderTestGame(component) {
        let data = component.getScreen()

        let x = 0
        let y = 0
        let color = 0
        let width = 32
        let height = 32
        let size = 10
        for (let i = 0; i < width; i++) {
            for (let j = 0; j < height; j++) {
                let n = i * width + j
                color = data[n] || 0
                x = j
                y = i

                let x1 = x * size
                let y1 = y * size
                this.canvas.fillStyle = colorMap[color]
                this.canvas.fillRect(x1, y1, size, size);
            }
        }
    }
}
