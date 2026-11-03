import assert from 'node:assert/strict'
import test from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { LoginForm } from './LoginForm.js'
import r from '../resources.json'

const html=(p?:boolean|null,onPinLogin?:(pin:string)=>void)=>renderToStaticMarkup(
 createElement(LoginForm,{busy:false,onLogin:()=>{},onPinLogin,pinPreferred:p}))

test('approved PIN screen shows only PIN, login, and the forgot link',()=>{
 const s=html(true,()=>{})
 assert.match(s,/one-time-code/);assert.doesNotMatch(s,/current-password/)
 assert.ok(s.includes(r.forgotPin)&&!s.includes(r.backToPin))
 assert.ok(s.includes(`>${r.login}</button>`))
})

test('password screen has no PIN field or return link',()=>{
 for(const p of[null,false]){const s=html(p,()=>{})
  assert.match(s,/current-password/);assert.doesNotMatch(s,/one-time-code/)
  assert.ok(!s.includes(r.forgotPin)&&!s.includes(r.backToPin))}
})
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
