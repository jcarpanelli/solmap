// NOTE: BrowserSolc is not used as a regular npm dependency.
// Instead, it is included as a global variable via a require in index.js.

// const compilerVersion = 'soljson-v0.4.20-nightly.2017.11.30+commit.cb16a5d3.js';
const compilerVersion = 'soljson-v0.4.24+commit.e67f0147.js';
// const compilerVersion = 'soljson-v0.4.23+commit.124ca40d.js';
// const compilerVersion = 'soljson-v0.4.22+commit.4cb486ee.js';
// const compilerVersion = 'soljson-v0.4.21+commit.dfe3193c.js';
// const compilerVersion = 'soljson-v0.4.20+commit.3155dd80.js';
// const compilerVersion = 'soljson-v0.4.19+commit.c4cbbb05.js';
// const compilerVersion = '';
// const compilerVersion = '';
// const compilerVersion = '';
// const compilerVersion = '';

const CompilerUtil = {

  compile(source) {
    return new Promise((resolve, reject) => {
    
      if(!CompilerUtil.compiler) {
        reject(`Compiler is not ready yet...`);
        return;
      }

      // Build solc standard json interface object.
      const sources = { "BasicToken": source };
      const options = { optimize: false };
      const json = CompilerUtil.buildStandardJSONInput(sources, options)
      const output = CompilerUtil.compiler.compileStandardWrapper(json);

      resolve(output);
    });
  },

  buildStandardJSONInput(sources, options) {
    const newSources = {};
    for(let contractKey in sources) {
      const contractContent = sources[contractKey];
      newSources[contractKey] = {
        content: contractContent
      };
    }
    const nativeSources = {
      language: "Solidity",
      sources: newSources,
      settings: {
        optmizer: {
          enabled: options.optimize
        },
        outputSelection: {
          "*": {
            "*": ["abi", "ast", "evm.deployedBytecode.opcodes", "evm.deployedBytecode.sourceMap"]
          }
        }
      }
    };
    const nativeSourcesStr = JSON.stringify(nativeSources);
    return nativeSourcesStr;
  },

  getCompiler() {
    console.log(`CompilerUtil - getCompiler(${compilerVersion})`);
    return new Promise(resolve => {
      console.log(`retrieving compiler...`);
      window.BrowserSolc.loadVersion(compilerVersion, compiler => {
        console.log(`compiler retrieved`);
        CompilerUtil.compiler = compiler;
        resolve();
      })
    });
  },

  getVersions() {
    if(window.BrowserSolc) {
      window.BrowserSolc.getVersions((sources, releases) => {
        console.log(releases);
      });
    }
  }
}

module.exports = CompilerUtil;
