(function () {

  const indicator = document.querySelector('.nav-indicator');
  const items = document.querySelectorAll('.nav-item');
  const body = document.querySelector('.main-body');

  function handleIndicator(el) {
    items.forEach(function (item) {
      item.classList.remove('is-active');
      item.removeAttribute('style');
    });
    indicator.style.width = "".concat(el.offsetWidth, "px");
    indicator.style.left = "".concat(el.offsetLeft, "px");
    indicator.style.backgroundColor = el.getAttribute('active-color');
    el.classList.add('is-active');
    el.style.color = el.getAttribute('active-color');
  }

  const routes = {
    // path: url
    '/': '/data/home.json',
    '/service': '/data/service.html',
    '/about': '/data/about.json'
  };

  const render = async path => {
    try {
      const url = routes[path];
      if (!url) {
        body.innerHTML = `${path} Not Found`;
        return;
      }

      const res = await fetch(url);
      const contentType = res.headers.get('content-type');

      if (contentType?.includes('application/json')) {
        const json = await res.json();
        body.innerHTML = `<h1>${json.title}</h1><p>${json.content}</p>`;
      } else {
        body.innerHTML = await res.text();
      }
    } catch (err) {
      console.error(err);
    }
  };

  /* add event listener for each item of navigation bar */
  items.forEach(function (item, index) {
    item.addEventListener('click', function (e) {
      e.preventDefault();
      const path = e.target.getAttribute('href');

      /* handle indicator */
      handleIndicator(e.target); 

      /* push history & ajax request to server */
      history.pushState({ path }, null, path);
      render(path);
    });
    item.classList.contains('is-active') && handleIndicator(item);
  });

  // popstate 이벤트는 history entry가 변경되면 발생한다.
  // PJAX 방식은 hash를 사용하지 않으므로 hashchange 이벤트를 사용할 수 없다.
  // popstate 이벤트는 pushState에 의해 발생하지 않는다.
  // 이전페이지 / 다음페이지 button 또는 history.back() / history.go(n)에 의해 발생한다.
  window.addEventListener('popstate', e => {
    // e.state는 pushState 메서드의 첫번째 인수
    console.log('[popstate]', e.state);
    // 이전페이지 / 다음페이지 button이 클릭되면 render를 호출
    render(e.state.path);
  });

  /* root path */
  render('/');

  /* refresh path -> route in server */

}());


     