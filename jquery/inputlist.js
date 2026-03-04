$(document).ready(function () {
    // 全域變數：目前高亮的項目
    let $highlighted = null;

    // 聚焦或輸入時顯示選單與篩選
    $(".inputList input").on("focus input", function () {
    const $input = $(this);
    const key = $input.data("inputlist");
    const $menu = $('[data-inputlistmenu="' + key + '"]');

    // 抓 .inputList 容器位置與寬度
    const $wrapper = $input.closest(".inputList");
    const offset = $wrapper[0].getBoundingClientRect();
    const showAbove = (window.innerHeight - offset.bottom) < 300;
    const top = showAbove
        ? offset.top - $menu.outerHeight()
        : offset.bottom;

    // 重設高亮
    $highlighted = null;

    // 顯示選單
    $(".inputList-menu").not($menu).fadeOut(150);
    $menu.css({
        position: "fixed",
        top: top+1 + "px",
        left: offset.left + "px",
        width: offset.width + "px",
        zIndex: 1000
    }).stop(true, true).fadeIn(200);

    // 即時篩選
    const searchVal = $input.val().toLowerCase();
    $menu.find("li").each(function () {
        const text = $(this).text().toLowerCase();
        $(this).toggle(text.includes(searchVal));
    });
    });

    // 鍵盤操作（套用到所有 .inputList input）
    $(".inputList input").on("keydown", function (e) {
        const $input = $(this);
        const key = $input.data("inputlist");
        const $menu = $('[data-inputlistmenu="' + key + '"]');
        const $items = $menu.find("li:visible");

        switch (e.key) {
            case "ArrowDown":
            e.preventDefault();
            if ($highlighted) {
                const $next = $highlighted.nextAll(":visible").first();
                if ($next.length) $highlighted = $next;
            } else {
                $highlighted = $items.first();
            }
            break;

            case "ArrowUp":
            e.preventDefault();
            if ($highlighted) {
                const $prev = $highlighted.prevAll(":visible").first();
                if ($prev.length) $highlighted = $prev;
            } else {
                $highlighted = $items.last();
            }
            break;

            case "Enter":
            e.preventDefault();
            if ($highlighted) {
                $input.val($highlighted.data("value"));
                $menu.fadeOut(150);
            }
            break;

            case "Escape":
            $menu.fadeOut(150);
            $input.blur()
            break;

            case "Tab":
                $menu.fadeOut(150);
                const $nextInput = $(".inputList input").eq(
                    $(".inputList input").index(this) + 1
                );
                if ($nextInput.length) {
                    e.preventDefault();
                    $nextInput.focus();
                }
            break;
        }

        // 高亮顯示目前項目，並自動捲動到可見範圍
        $items.removeClass("active");
        if ($highlighted) {
            $highlighted.addClass("active")[0].scrollIntoView({
            block: "nearest",
            inline: "nearest"
            });
        }
    });

    // 點選選單項目後，填入 input 並關閉選單
    $(".inputList-menu").on("click", "li", function () {
    const value = $(this).data("value");
    const key = $(this).closest(".inputList-menu").data("inputlistmenu");
    $('[data-inputlist="' + key + '"]').val(value);
    $(this).closest(".inputList-menu").fadeOut(150);
    });

    // 點擊外部時關閉所有選單
    $(document).on("click", function (e) {
    if (
        !$(e.target).closest(".inputList").length &&
        !$(e.target).closest(".inputList-menu").length
    ) {
        $(".inputList-menu").fadeOut(150);
    }
    });

    // 當 input 失去焦點時關閉選單（延遲是為了保留 click 事件）
    $(".inputList input").on("blur", function () {
        setTimeout(() => {
        const key = $(this).data("inputlist");
        const $menu = $('[data-inputlistmenu="' + key + '"]');
        $menu.fadeOut(150);
        }, 150);
    });

});
