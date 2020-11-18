const jitterMax = 1000;

const jitter = ()=>{
  return Math.random() * jitterMax;
};

const delay = ms=>{
  return new Promise(res=>{setTimeout(res, ms + jitter())});
};

export const retry = (fn, retries = 3, retryDelay = 2000)=>{
  return fn()
  .catch(err=>{
    console.error(`${err.message}. ${retries} retries remaining`);

    return retries <= 0 ?
      Promise.reject(err) :
      delay(retryDelay).then(()=>retry(fn, retries - 1, retryDelay * 2));
  });
};
