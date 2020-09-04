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