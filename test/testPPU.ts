const testPPU1 = function() {
    let dataBus = DataBus.new()
    let ppu = PPU.new(dataBus)

    let cartridge = Cartridge.new()
    cartridge.insertChrROM = () => {
        ppu.loadCHRROM(cartridge.chrROM)
        ppu.getPatternTables()
    }
}

const testPPU = function() {
    testPPU1()
}

testPPU()
