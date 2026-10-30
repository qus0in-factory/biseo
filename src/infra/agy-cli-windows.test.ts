import test from'node:test'
import assert from'node:assert/strict'
import{cliWindow}from'./agy-cli-windows.js'
test('cli window covers contract and hyphen variants',()=>{
 for(const w of['Five Hour Limit Remaining','five-hour limit remaining','FIVE_HOUR LIMIT','5h','5 hour'])assert.equal(cliWindow(w),'5h')
 for(const w of['Weekly Limit Remaining','weekly','WEEKLY'])assert.equal(cliWindow(w),'weekly')
 assert.equal(cliWindow('mystery'),('mystery'))
})
