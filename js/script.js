(function() {
    function inputAdd() {
        var $form_add_list = Array.prototype.slice.call(document.querySelectorAll(".form-input--add"));
        $form_add_list.forEach(function($el) {
            var $input = $el.querySelector("input");
            $input.onfocus = function() {
                $input.value = (dateToNumber($input.value));
            };
            $input.onblur = function() {
                $input.value = (getCount(dateToNumber($input.value), $input_keys_arr));
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
    }

    function changeValue($el, $op) {
        if (hasClass($el.parentNode, "form-input--days")) {
            var $keys_arr = ["день", "дня", "дней"];
            var $days = true;
        } else $keys_arr = ["чел", "чел", "чел"];
        var $val = dateToNumber($el.value);
        if ($op === "sub" && $val > 0) {
            $val--;
            if (!$days) changeCompanion($val);
        } else if ($op === "add") {
            $val++;
            if (!$days) changeCompanion($val);
        }
        $el.value = getCount($val, $keys_arr);
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
            var $node = document.querySelector(".companion--" + $i);
            $node.parentNode.removeChild($node);
        }
        if ($value > 0) document.querySelector(".form-divider--companions").style.display = "block";
        else document.querySelector(".form-divider--companions").style.display = "none";
    }

    function deleteCompanion($el) {
        var $node = $el.parentNode;
        $node.parentNode.removeChild($node);
        var $companions = Array.prototype.slice.call(document.querySelectorAll(".companion"));
        console.log($companions);
        $companions.map(function($comp, $i) {
            $comp.innerHTML = $comp.innerHTML.replace(/\d/ig, $i+1);
            $comp.querySelector(".companion__delete").addEventListener("click", function() {
                deleteCompanion(this);
            })
        });
        changeValue(document.querySelector(".companions input"), "sub");
    }

    function formSubmit() {
        var $form = document.querySelector("form");
        if ($form) $form.addEventListener("submit", function(event) {
            if (!("FormData" in window)) return;
            event.preventDefault();
            function request(data, fn) {
                var xhr = new XMLHttpRequest();
                xhr.open("post", "https://echo.htmlacademy.ru/adaptive?" + (new Date().getTime()));
                xhr.onreadystatechange = function() {
                    if (xhr.readyState == 4) fn(xhr.responseText);
                };
                xhr.send(data);
            }
            var data = new FormData($form);
            request(data, function(response) {
                console.log(response);
            });
        });
    }

    function navToggle() {
        var $icon = document.querySelector(".main-header__toggle-icon");
        document.querySelector(".top-navigation").style.maxHeight = document.querySelectorAll(".top-navigation__item").length * 74;
        myTap = new Tap($icon);
        $icon.addEventListener("tap", function() {
            toggleClass(this, "main-header__toggle-icon--opened");
            toggleClass(document.querySelector(".top-navigation"), "top-navigation--opened");
            toggleClass(document.querySelector(".main-header__line"), "main-header__line--opened");
        });
    }

    function uploadFile() {
        var $form = document.querySelector("form");
        if ($form) $form.querySelector("#photos_upload").addEventListener("change", function() {
            var $files = Array.prototype.slice.call(this.files);
            var $i = 0;
            if ($files.length) $files.forEach(function(file) {
                function error($message) {
                    var $alert = document.querySelector(".alert--photos");
                    if ($alert) {
                        $alert.innerHTML = "<span>" + $message + "</span>";
                    } else {
                        $alert = document.createElement("div");
                        $alert.className = "alert alert--photos";
                        $alert.innerHTML = "<span>" + $message + "</span>";
                        $input = document.querySelector(".photos__btn").nextSibling;
                        document.querySelector(".photos fieldset").insertBefore($alert, $input);
                    }
                }
                if (file.type.match(/image.*/)) {
                    var reader = new FileReader();
                    reader.onload = function(e) {
                        $i++;
                        var $preview = e.target.result;
                        if (file.size > 1048576) {
                            error ("Неправильный размер файла!");
                            return;
                        }
                        var $image = document.createElement("div");
                        $image.className = "photos__item";
                        $image.innerHTML = "<div class=\"photos__close\">\n"
                            + "<svg viewBox=\"-1 0 12 12\"><use xmlns:xlink=\"http://www.w3.org/1999/xlink\" xlink:href=\"#no\"></use></svg></div>\n"
                            + "<img class=\"photos__image\" src=\"" + $preview + "\">\n"
                            + "<div class=\"photos__label\">IMG-" + $i + ".JPG</div>";
                        document.querySelector(".form-divider--photos").style.display = "block";
                        document.querySelector(".photos__items").appendChild($image);
                    };
                } else {
                    error("Неправильный тип файла!");
                    return;
                }
                reader.readAsDataURL(file);
            });
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

    function dateToNumber($date) {
        if ($date = $date.replace(/[^\d]/gi, "")) return $date;
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
    uploadFile();
    navToggle();
})();