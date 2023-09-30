(()=>{

    function uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
        .replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0, 
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    const sceneRefs = "sceneRefs"
    window.storage = {
        activeSceneKey: null,
        getScenes(){
            let refs = JSON.parse(localStorage.getItem(sceneRefs) || "[]")

        },
        loadScene(key){
            console.log(key)
            return JSON.parse(localStorage.getItem(key))
        },
        saveScene(ref){
            const scene = storage.loadScene(ref)
            const elements = document.querySelectorAll('.vVertical')
            for(const element of elements){
                scene.data[element.id] = element.value
            }
            localStorage.setItem(ref, JSON.stringify(scene))
        },
        saveAs(name){
            if(!name) return
            const scene = {}
            scene.name = name
            scene.time = new Date();
            scene.data = {}
            //Save data
            const elements = document.querySelectorAll('.vVertical')
            for(const element of elements){
                scene.data[element.id] = element.value
            }
            const ref = uuidv4()
            scene.ref = ref
            localStorage.setItem(`#${ref}`, JSON.stringify(scene))
            storage.saveSceneRef(ref, name)
            storage.loadSceneSelect()
        },
        saveSceneRef(ref, name){
            let refs = JSON.parse(localStorage.getItem(sceneRefs) || "[]")
            refs.push({key: `#${ref}`, uuid: ref, name: name})
            localStorage.setItem(sceneRefs, JSON.stringify(refs))
        },
        loadSceneSelect(){
            const select = document.getElementById("sceneSelect");
            code = ""
            let refs = JSON.parse(localStorage.getItem(sceneRefs) || "[]")
            code += "<option selected value='null'>Wybierz scenę</option>"
            for(const ref of refs){
                code += `<option value="${ref.key}">${ref.name}</option>`
            }
            select.innerHTML = code
        },
        activeScene(scene){
            const nameWrapper = document.getElementById("nameWrapper");
            if(scene){
                nameWrapper.innerHTML = scene.name
                window.storage.activeSceneName = scene.name
                window.storage.activeSceneKey = `#${scene.ref}`
            }else{
                nameWrapper.innerHTML = "Nowa scena...   "
            }
            
            
        }
    }

    window.saveScene = () => {
        console.log(window.storage.activeSceneKey)
        if(!window.storage.activeSceneKey) saveAs()
        storage.saveScene(window.storage.activeSceneKey)

    }
    window.saveAs = () => {
        const name = prompt("Jak nazwać scenę");
        if(!name) return 
        window.storage.saveAs(name)
    }
    window.changeScene = () => {
        const select = document.getElementById("sceneSelect");
        if(select.value == "null" || !select.value){
            storage.activeScene(null)
            return
        }
        const scene = storage.loadScene(select.value)
        storage.activeScene(scene)
        for(const id in scene.data){
            const element = document.getElementById(id);
            element.value = scene.data[id]
            sdSlVchange(id)
        }
        storage.loadSceneSelect()
    }
})()