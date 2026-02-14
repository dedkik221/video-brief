(function () {
  var form = document.getElementById("requestForm");
  var preview = document.getElementById("jsonPreview");
  var notice = document.getElementById("notice");
  var copyBtn = document.getElementById("copyJsonBtn");
  var lastPayload = null;

  function setNotice(type, text) {
    notice.className = "notice " + type;
    notice.textContent = text;
  }

  function buildPayload() {
    var fd = new FormData(form);
    return {
      serviceType: String(fd.get("serviceType") || "").trim(),
      eventDate: String(fd.get("eventDate") || "").trim(),
      location: String(fd.get("location") || "").trim(),
      durationHours: Number(fd.get("duration")),
      techNeeds: String(fd.get("techNeeds") || "").trim(),
      notes: String(fd.get("notes") || "").trim(),
      source: "standalone_mvp",
      createdAt: new Date().toISOString()
    };
  }

  function validate(payload) {
    if (!payload.serviceType) return "Выберите тип услуги.";
    if (!payload.eventDate) return "Укажите дату события.";
    if (!payload.location) return "Укажите локацию.";
    if (!payload.durationHours || payload.durationHours < 1) return "Длительность должна быть не менее 1 часа.";
    if (!payload.techNeeds) return "Заполните технические требования.";
    return null;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var payload = buildPayload();
    var err = validate(payload);

    if (err) {
      setNotice("err", err);
      return;
    }

    lastPayload = payload;
    preview.textContent = JSON.stringify(payload, null, 2);
    setNotice("ok", "Данные валидны. Этот JSON можно использовать для будущей интеграции Jira/PDF.");
  });

  copyBtn.addEventListener("click", function () {
    if (!lastPayload) {
      setNotice("err", "Сначала соберите JSON кнопкой проверки.");
      return;
    }

    navigator.clipboard.writeText(JSON.stringify(lastPayload, null, 2))
      .then(function () {
        setNotice("ok", "JSON скопирован в буфер.");
      })
      .catch(function () {
        setNotice("err", "Не удалось скопировать JSON. Проверьте доступ к буферу обмена.");
      });
  });
})();
