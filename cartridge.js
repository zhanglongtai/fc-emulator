// 512-byte Trainer
const TrainerPresent = {
    NotPresent: 0, // Not present
    Present: 1, // Present between Header and PRG-ROM data
}

// Hard-wired nametable mirroring type
const MirroringType = {
    Horizontal: 0,
    Vertical: 1,
}

const headerSize = 16
const prgRomBase = 0x4000 // 16384
const chrRomBase = 0x2000 // 8192

class Cartridge {
    /**
     * @param { DataBus } dataBus - DataBus实例
     */
    constructor(dataBus) {
        this.dataBus = dataBus
        this.bindROMLoad()
    }

    static new(...args) {
        let i = new this(...args)
        return i
    }

    bindROMLoad() {
        let e = document.querySelector('#id-rom')
        e.addEventListener('input', (event) => {
            let file = event.target.files[0]

            const reader = new FileReader();
            reader.onload = (event) => {
                let r = event.target.result
                this.parseROM(r)
                this.insertPrgROM()
                this.insertChrROM()
            };
            reader.readAsArrayBuffer(file);
        })
    }

    insertPrgROM() {}

    insertChrROM() {}

    parseROM(rom) {
        let n = new Uint8Array(rom)
        let header = n.slice(0, headerSize)
        let name = header.slice(0, 4)
        let prgRomAmount = header[4]
        let chrRomAmount = header[5]

        let flags6 = flagsFormatted(header[6])

        let flags7 = flagsFormatted(header[7])

        let mapperNumberLower = flags6.slice(4).reverse()
        let mapperNumberUpper = flags7.slice(4).reverse()

        let trainerSize = 0
        if (flags6[2] === TrainerPresent.Present) {
            trainerSize = 512
        }

        let prgStart = headerSize + trainerSize
        let prgRom = n.slice(prgStart, prgStart + prgRomAmount * prgRomBase)
        this.prgROM = Array.from(prgRom)

        let chrStart = prgStart + prgRomAmount * prgRomBase
        let chrRom = n.slice(chrStart, chrStart + chrRomAmount * chrRomBase)
        this.chrROM = Array.from(chrRom)

        log('===== Load NES ROM Successfully =====')
        log(`File Identification: ${stringFromBinaryArray(name)}`)
        log(`prgROM size: ${prgRom.length / 1024}KB`)
        log(`chrROM size: ${chrRom.length / 1024}KB`)
        log(`Total size: ${n.length / 1024}KB`)
    }
}
