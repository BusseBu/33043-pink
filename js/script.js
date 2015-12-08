(function() {
    function inputAdd() {
       $(".form-input--add").each(function () {
           $this = $(this);
           var $input = $this.find("input");
           var $input_type = $(this).hasClass("form-input--days") ? "days" : "ppl";
           $input.off("focus").on("focus", function() {
                $input.val(dateToNumber($input.val()));
           });
           $input.off("focusout").on("focusout", function() {
               $input.val(getCount(dateToNumber($input.val()), ["день", "дня", "дней"]));
           });
           $this.find(".form-input__plus-minus").off("click").on("click", function () {
               var $input_val = dateToNumber($input.val());
               if ($(this).hasClass("form-input__plus-minus--minus")) {
                   if ($input_val > 0) $input_val--;
               }
               else $input_val++;
               if ($input.val() !== $input_val) $input.val(($input_type == "days" ? getCount($input_val, ["день", "дня", "дней"]) : $input_val + " чел"));
           });
       });
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

})();