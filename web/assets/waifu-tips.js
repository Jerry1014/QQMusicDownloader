String.prototype.render = function (context) {
    var tokenReg = /(\\)?\{([^\{\}\\]+)(\\)?\}/g;

    return this.replace(tokenReg, function (word, slash1, token, slash2) {
        if (slash1 || slash2) {
            return word.replace('\\', '');
        }

        var variables = token.replace(/\s/g, '').split('.');
        var currentObject = context;
        var i, length, variable;

        for (i = 0, length = variables.length; i < length; ++i) {
            variable = variables[i];
            currentObject = currentObject[variable];
            if (currentObject === undefined || currentObject === null) return '';
        }
        return currentObject;
    });
};

function initModel(waifuPath) {

    if (waifuPath === undefined) waifuPath = '';
    var modelId = 5;
    var modelTexturesId = 1;

    loadModel(modelId, modelTexturesId);
}

function loadModel(modelId, modelTexturesId) {
    localStorage.setItem('modelId', modelId);
    if (modelTexturesId === undefined) modelTexturesId = 0;
    localStorage.setItem('modelTexturesId', modelTexturesId);

    var curPath = window.document.location.href;
    var pathName = window.document.location.pathname;
    var pos = curPath.indexOf(pathName);
    var path = curPath.substring(0, pos) + pathName.substring(0, pathName.substr(1).indexOf('/') + 1) + '/L?model_name=shizuku&texture_id=0';

    loadlive2d('live2d', path, console.log('live2d', '加载模型 ' + path));
    // loadlive2d('live2d', 'https://api.fghrsh.net/live2d/get/?id='+modelId+'-'+modelTexturesId, console.log('live2d','模型 '+modelId+'-'+modelTexturesId+' 加载完成'));
}