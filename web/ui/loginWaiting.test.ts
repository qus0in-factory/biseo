import assert from'node:assert/strict'
import test from'node:test'
import{createElement}from'react'
import{renderToStaticMarkup}from'react-dom/server'
import{LoginForm}from'./LoginForm.js'
import r from'../resources.json'

test('the first screen waits on a skeleton before the PIN decision',()=>{
 const s=renderToStaticMarkup(createElement(LoginForm,{busy:false,onLogin:()=>{},onPinLogin:()=>{}}))
 assert.match(s,/aria-busy="true"/)
 assert.doesNotMatch(s,/current-password|one-time-code/)
 assert.ok(!s.includes(`>${r.login}</button>`))
})

test('without a PIN callback the first screen is the password form',()=>{
 const s=renderToStaticMarkup(createElement(LoginForm,{busy:false,onLogin:()=>{}}))
 assert.match(s,/current-password/)
 assert.doesNotMatch(s,/aria-busy="true"/)
})
