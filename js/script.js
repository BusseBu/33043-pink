(function() {
    function inputAdd() {
        var $form_add_list = Array.prototype.slice.call(document.querySelectorAll(".form-input--add"));
        $form_add_list.forEach(function($el) {
            var $input_keys_arr = hasClass($el, "form-input--days") ? ["день", "дня", "дней"] : ["чел", "чел", "чел"];
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
                    var $input_val = dateToNumber($input.value);
                    if (hasClass($button, "form-input__plus-minus--minus")) {
                        if ($input_val > 0) $input_val--;
                    } else $input_val ++;
                    if ($input.value !== $input_val) $input.value = getCount($input_val, $input_keys_arr);
                });
            });
        });
    }

    function formSubmit() {
        var $form = document.querySelector("form");
        $form.addEventListener("submit", function(event) {
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

})();