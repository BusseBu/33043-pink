(function() {
  function inputAdd() {
    var $form_add_list = Array.prototype.slice.call(document.querySelectorAll(".form-input--add"));
    $form_add_list.forEach(function($el) {
      var $input = $el.querySelector("input");
      $input.onfocus = function() {
        if ($input.readOnly) return;
        $input.value = (valueToNumber($input.value));
      };
      $input.onblur = function() {
        if (hasClass($el, "form-input--days")) {
          var $keys_arr = ["день", "дня", "дней"];
        } else $keys_arr = ["чел", "чел", "чел"];
        $input.value = (getCount(valueToNumber($input.value), $keys_arr));
      };
      var $input_buttons = Array.prototype.slice.call($el.querySelectorAll(".form-input__plus-minus"));
      $input_buttons.forEach(function($button) {
        $button.addEventListener("click", function() {
          if (hasClass($button, "form-input__plus-minus--minus")) {
            changeValue($input, "sub");
          } else changeValue($input, "add");
        });
      });
    });
    var $form_date = document.querySelector("#depart-date");
    if ($form_date) $form_date.addEventListener("change", function() {
      changeDate();
    });
  }

  function changeValue($el, $op) {
    if (hasClass($el.parentNode, "form-input--days")) {
      var $keys_arr = ["день", "дня", "дней"];
      var $days = true;
    } else $keys_arr = ["чел", "чел", "чел"];
    var $val = valueToNumber($el.value);
    if ($op === "sub" && $val > 0) {
      $val--;
      $el.value = getCount($val, $keys_arr);
      if ($days) changeDate();
      else changeCompanion($val);
    } else if ($op === "add") {
      $val++;
      $el.value = getCount($val, $keys_arr);
      if ($days) changeDate();
      else changeCompanion($val);
    }
  }

  function changeCompanion($value) {
    var $i = document.querySelectorAll(".companion").length;
    if ($value > $i) {
      $i++;
      var $companion = document.createElement("div");
      var $companion_t = '<div class="companion__wrapper">' +
        '<div class="number-input">' +
        '<label class="number-input__label" for="list-number-{{i}}">№</label>' +
        '<input class="number-input__input" type="text" name="list-number-{{i}}" id="list-number-{{i}}" value="{{i}}" disabled>' +
        '</div>' +
        '<div class="double-input">' +
        '<div class="double-input__wrap double-input__wrap--comp-name">' +
        '<label class="double-input__label" for="comp-name-{{i}}">Имя: *</label>' +
        '<input class="double-input__input" type="text" name="comp-name-{{i}}" id="comp-name-{{i}}" value="Введите ваше имя" required>' +
        '</div>' +
        '<div class="double-input__wrap double-input__wrap--comp-nickname">' +
        '<label class="double-input__label" for="comp-nickname-{{i}}">Прозвище:</label>' +
        '<input class="double-input__input" type="text" name="comp-nickname-{{i}}" id="comp-nickname-{{i}}" value="Ну как же без этого!">' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<div class="companion__delete">удалить</div>';
      $companion.className = "companion companion--" + $i;
      $companion.innerHTML = $companion_t.replace(/{{\i}}/g, $i);
      document.querySelector(".companions fieldset").appendChild($companion);
      $companion.querySelector(".companion__delete").addEventListener("click", function() {
        deleteCompanion(this);
      })
    } else if ($value < $i) {
      document.querySelector(".companions fieldset").lastChild.remove();
    }
    if ($value > 0) document.querySelector(".form-divider--companions").style.display = "block";
    else document.querySelector(".form-divider--companions").style.display = "none";
  }

  function deleteCompanion($el) {
    var $node = $el.parentNode;
    $node.parentNode.removeChild($node);
    var $companions = Array.prototype.slice.call(document.querySelectorAll(".companion"));
    $companions.map(function($comp, $i) {
      $comp.innerHTML = $comp.innerHTML.replace(/\d/ig, $i+1);
      $comp.querySelector(".companion__delete").addEventListener("click", function() {
        deleteCompanion(this);
      })
    });
    changeValue(document.querySelector(".companions input"), "sub");
  }

  function changeDate() {
    var moment = require('moment');
    moment.locale("ru", {
      months: [
        "января", "февраля", "марта", "апреля", "мая", "июня",
        "июля", "августа", "сентября", "октября", "ноября", "декабря"
      ]
    });
    var $depart_date = document.querySelector("#depart-date");
    if ($depart_date) {
      var $day = moment((document.querySelector("#depart-date").value ? document.querySelector("#depart-date").value : "1 апреля 2015"), "DD MMMM YYYY", "ru");
      if ($day.isValid()) {
        $add = valueToNumber(document.querySelector("#travel-duration").value);
        $day.add($add, "days");
        document.querySelector("#return-date").value = $day.format("D MMMM YYYY");
      } else alert ("Пожалуйста, введите верную дату!");
    }
  }

  function formSubmit() {
    var $form = document.querySelector("form");
    var $queue = [];
    var $i = 0;
    var $upload = document.querySelector("#photos_upload")
    if ($upload) $upload.addEventListener("change", function() {
      var $files = Array.prototype.slice.call(this.files);
      if ($files.length) $files.forEach(function(file) {
        $queue.push(preview(file));
      });
      this.value = "";
    });
    function preview(file) {
      if (file.type.match(/image.*/)) {
        var reader = new FileReader();
        reader.onload = function(e) {
          var $preview = e.target.result;
          var $image = document.createElement("div");
          $image.className = "photos__item";
          $image.innerHTML = "<div class=\"photos__close\">\n"
            + "<svg viewBox=\"-1 0 12 12\"><use xmlns:xlink=\"http://www.w3.org/1999/xlink\" xlink:href=\"#no\"></use></svg></div>\n"
            + "<div class=\"photos__image\"><img src=\"" + $preview + "\"></div>\n"
            + "<div class=\"photos__label\">IMG-" + ++$i + ".JPG</div>";
          document.querySelector(".form-divider--photos").style.display = "block";
          document.querySelector(".photos__items").appendChild($image);
          $image.querySelector(".photos__close").addEventListener("click", function() {
            $queue = $queue.filter(function ($el) {
              return $el != file;
            });
            this.parentNode.remove();
          });
        };
        reader.readAsDataURL(file);
        return file;
      }
    }
    if ($form) $form.addEventListener("submit", function(event) {
      if (!("FormData" in window)) return;
      event.preventDefault();
      var data = new FormData($form);
      $queue.forEach(function($el) {
        data.append("images", $el);
      });
      request(data, function(response) {
        document.querySelector(".submit__input").className = "submit__input";
        console.log(response);
      });
    });
  }

  function request(data, fn) {
    var xhr = new XMLHttpRequest();
    document.querySelector(".submit__input").className = "submit__input submit__input--process";
    xhr.open("post", "https://echo.htmlacademy.ru/adaptive?" + (new Date().getTime()));
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) fn(xhr.responseText);
    };
    xhr.send(data);
  }

  function navToggle() {
    var $icon = document.querySelector(".main-header__toggle-icon");
    document.querySelector(".top-navigation").style.maxHeight = document.querySelectorAll(".top-navigation__item").length * 74;
    var Tap = require('tap.js');
    myTap = new Tap($icon);
    $icon.addEventListener("tap", function() {
      toggleClass(this, "main-header__toggle-icon--opened");
      toggleClass(document.querySelector(".top-navigation"), "top-navigation--opened");
      toggleClass(document.querySelector(".main-header__line"), "main-header__line--opened");
    });
  }

  function toggleClass($el, $classname) {
    if ($el.className.indexOf($classname) !== -1) {
      return $el.className = $el.className.replace($classname, "");
    } else {
      if ($el.className.match(/\s$/)) return $el.className += $classname;
      else return $el.className += (" " + $classname);
    }
  }

  function hasClass($el, $classname) {
    return $el.className.indexOf($classname) !== -1;
  }

  function valueToNumber($value) {
    if ($value = $value.replace(/[^\d]/gi, "")) return $value;
    return 0;
  }

  function getCount ($number, $keys) {
    $number = Math.ceil($number);
    var $r;
    if ($number >= 10 && $number <= 20) $r = $keys[2];
    else if ($number % 10 == 1) $r = $keys[0];
    else if ($number % 10 > 1 && $number % 10 < 5) $r = $keys[1];
    else $r = $keys[2];
    return $number + " " + $r;
  }

  inputAdd();
  formSubmit();
  navToggle();
})();
