// 初始化sku最短路径表
const getSkuMcl = (skuData) => {
    let existSkus = {}
    skuData.forEach(item => {
        let skuGroup = item.skuId.split('')
        if (Number(item.stock) === 0) return
        let existSku = skuGroup.map((id, idx) => {
            return skuGroups[idx].list.find(item => Number(item.id) === Number(id)).value
        })
        // 求幂集 后一项依赖前一项的组合
        let ps = ['']
        existSku.forEach((skuAttr, i) => {
            ps.forEach((item1, j) => {
                const prevItem = ps[j]
                const exitKey = prevItem + (prevItem === '' ? '': '-') + skuAttr
                ps.push(exitKey)
                if (!existSkus[exitKey]) {
                    existSkus[exitKey] = [
                        item
                    ]
                } else {
                    existSkus[exitKey].push(item)
                }
                
            })
        })
    })
    return existSkus
}


// 生成对应dom的数据
function getMapDomData (skuGroups, mcl){
    let btnDisabledData = []
    let clickedBtnData = []

    skuGroups.forEach((item, idx) => {
        btnDisabledData.push([])
        clickedBtnData.push([])
        item.list.forEach((item, idx1) => {
            btnDisabledData[idx].push(!Boolean(mcl[item.value]))
            clickedBtnData[idx].push({value: item.value, clicked: false})
        })
    })
    return {btnDisabledData, clickedBtnData}
}


// 点击后重新设置dom样式
const setDomStyle = (doms, btnDisabledData, clickedBtnData) => {
    doms.forEach((itemList, idx) => {
        itemList.forEach((btn, idx1) => {
            if(btnDisabledData[idx][idx1]) {
                btn.attr('disabled', 'true')
            } else {
                btn.removeAttr('disabled')
            }
            if(clickedBtnData[idx][idx1].clicked) {
                btn.addClass('clicked')
            } else {
                btn.removeClass('clicked')
            }
        })
    })
}

// 生成最初dom
const initDom = ($box, btnDisabledData) => {
    let doms = []
    skuGroups.forEach((item, idx) => {
        const $dom =  $(
            `<div class='attr-item'>
                ${item.name}:
            </div>`
        );
        let len = doms.push([])
        item.list.forEach((item1, idx1)=> {
            let $listItem = $(`
                <input
                    type="button"
                    class="sku"
                    ${btnDisabledData[idx][idx1] ? 'disabled' : ''}
                    data-idx=${idx}
                    data-idx1="${idx1}"
                    value="${item1.value}"
                    onclick="clickSku(event)"
                />
            `)
            doms[len - 1].push($listItem)
            $listItem.appendTo($dom)
        })
        $dom.appendTo($box)
    })
    return doms
}
