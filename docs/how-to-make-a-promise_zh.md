# 实现 Promise/Promise.all/Promise.race

## 实现 Promise

```
class TinyPromise {
  succeed = null
  fail = null
  state = 'pending' 

  constructor(fn) {
    fn(this.resolve.bind(this), this.reject.bind(this))
  }
  
  resolve(result) {
    setTimeout(() => {
      this.state = 'fulfilled' 
      this.succeed(result)
    })
  }

  reject(reason) {
    setTimeout(() => {
      this.state = 'rejected' 
      this.fail(reason)
    })
  }

  then(succeed, fail) {
    this.succeed = succeed
    this.fail = fail
  }
}

```

关于Promise的原理和用法这里不再赘述，以上实现是极简版，未实现级联和catch。

## 实现 Promise.all
方法返回一个Promise实例，此实例在 iterable 参数内所有的promise 都完成（resolved）时回调完成（resolve）；如果参数中 promise有一个失败（rejected），此实例回调失败（reject），失败的原因是第一个失败promise的结果。

TinyPromise.all = function(arrP) {
  let list = []
  let len = 0
  let hasErr = false
  return new TinyPromise((resolve, reject) => {
    for(let i = 0; i < arrP.length; i++) {
      arrP[i].then( data=> {
        list[i] = data
        len++
        len === arrP.length && resolve(list)
      }, error => {
        !hasErr && reject(error)
        hasErr = true
      })
    }
  })
}

## 实现Promise.race
方法返回一个Promise实例，一旦迭代器中的某个 promise 完成(resolved)或失败(rejected)，返回的 promise 就会 resolve 或 reject

```
TinyPromise.race = function(arrP) {
  let hasValue = false
  let hasError = false
  return new TinyPromise((resolve, reject) => {
    for(let i = 0; i < arrP.length; i++) {
      arrP[i].then(data => {
        !hasValue && !hasError && resolve(data) 
        hasValue = true
      }, error => {
        !hasValue && !hasError &&reject(error)
        hasError = true
      })
    }
  })
}
```

## 测试代码

```
new TinyPromise((resolve, reject) => {
  let [val, time] = [Math.random(), Math.random() * 1000]
  setTimeout(() => {
    val>0.2?resolve(val):reject(val)
  }, time)
}).then(
  val => console.log('promise 测试:' , val), 
  err => console.error('promise 测试:'+ err)
)

const getPList = () => {
  let arrP = []
  for(let i=0; i< 10; i++) {
    arrP[i] = new TinyPromise((resolve, reject) => {
      let [v, t] = [Math.random(), Math.random() * 1000]
      setTimeout(() => {
        v > 0.1 ? resolve(v) : reject(v)
      }, t)
    })
  }
  return arrP
}

TinyPromise.all(getPList()).then(
  data => console.log('promise.all 测试:', data),
  err => console.error('promise.all 测试:'+ err)
)


TinyPromise.race(getPList()).then(
  data => console.log('promise.race 测试:', data), 
  err => console.error('promise.race 测试:' + err)
)
```