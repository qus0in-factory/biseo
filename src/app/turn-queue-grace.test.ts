import test from'node:test'
import{transientLoss}from'./turn-queue-grace-transient.js'
import{cancelDuringGrace}from'./turn-queue-grace-cancel-case.js'
import{dropAfterGrace}from'./turn-queue-grace-drop-case.js'
const cases=[
 ['target_not_found waits for a transient pane loss',transientLoss],
 ['cancel during target grace does not start the removed turn',cancelDuringGrace],
 ['still missing drops after the configured grace',dropAfterGrace],
]as const
for(const[name,fn]of cases)test(name,fn)
