import{describe,it}from'node:test'
import assert from'node:assert/strict'
import React from'react'
import{renderToStaticMarkup}from'react-dom/server'
import{LoginForm}from'./LoginForm'
const h=(p?:boolean|null)=>renderToStaticMarkup(React.createElement(LoginForm,
{busy:false,onLogin:()=>{},onPinLogin:()=>{},pinPreferred:p}))
describe('LoginForm',()=>{
 it('renders hidden username and password by default',()=>{
  const s=h();assert.match(s,/auto[Cc]omplete="username"/)
  assert.match(s,/class="[^"]*hidden[^"]*"/);assert.match(s,/current-password/)
  assert.doesNotMatch(s,/role="group"/)})
 it('shows PIN first only when preferred',()=>{
  const s=h(true);assert.match(s,/role="group"/);assert.match(s,/6자리 PIN/)
  assert.doesNotMatch(s,/current-password/)})
 it('keeps PIN hidden while loading or denied',()=>{
  for(const p of[undefined,null,false]){const s=h(p)
   assert.doesNotMatch(s,/role="group"/);assert.match(s,/current-password/)}})
})
