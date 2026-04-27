// 代码块语言识别

$(function () {
  // 为每个代码块添加语言标签
  $('.code-area').each(function () {
    var $codeArea = $(this);
    var $pre = $codeArea.find('pre');

    // 如果已经存在语言标签，跳过
    if ($codeArea.find('.code_lang').length > 0) {
      return;
    }

    var code_language = $pre.attr('class') || '';

    // 提取语言名称
    var lang_name = code_language
      .replace('line-numbers', '')
      .trim()
      .replace('language-', '')
      .trim();

    // 如果没有语言名称，使用默认值
    if (!lang_name) {
      lang_name = 'code';
    }

    // 创建语言标签并添加到代码区域
    var $highlight_lang = $('<div class="code_lang"></div>').text(lang_name);
    $codeArea.prepend($highlight_lang);
  });
});
