## Sku（stock-keeping-unit: 最小度量单位) 算法的实现

### 基于博文：
 - link: https://www.cnblogs.com/xiaocaiyuxiaoniao/p/9790221.html 
 - 照着以上博文思路的实现。


### TODO
- [x] 选择最小一项后置灰
- [ ] 显示价格，库存量数据
- [ ] 显示初始化耗时以及点击计算的耗时（除去dom渲染）


### 算法应用场景
例如在某宝买衣服时知道某些属性组合已经不可买（置灰），例子：
1. 模拟数据结构

    1. 属性集合
    ```javascript
        {
            '颜色': ['红色', '蓝色', '绿色'],
            '尺码': ['m', 'xl', 'l']
        }
    ```

    2. 具体库存商品数据
    ```javascript
        [
            {skuId: '200', '颜色': '红色', '尺码': 'l'}, // 代表具体的一个商品
            {skuId: '111', '颜色': '蓝色', '尺码': 'xl'}, 
            {skuId: '000', '颜色': '蓝色', '尺码': 'm'}
        ]
    ```

2. 操作：
    1. 购物车模块弹起来时，将不在库存的属性置灰，例如将`绿色`置灰
    2. 我选择了`红色`，代表`红色-xl`不在库存商品组合当中，则将`xl`置灰
    3. ...


### 前置准备：

1. 可能需要了解高中的排列组合

2. 了解笛卡尔积及其算法的实现（多列数组的全组合）。

3. 了解幂集及其算法实现（列出集合的所有的子集）。

4. 写复杂代码最好带上笔纸，或者流程图等软件工具协助思维。（有推荐的吗？）


### Tips 
算法入门提示，来自朗文词典，算法一词的解释为：
> Algorithm :
> An algorithm is a series of mathematical steps, especially in a computer program, which will give you the answer to a particular kind of problem or question.

当时觉得自己怎么学算法都学不会，就去百度了一下为什么，然后有个说需要看算法的英文示意。结合`全组合算法`我对这段文字是这样理解：

1. 首先需要将现实中的问题与抽象成数字和符号可表示的方式
2. 接着因为算法是一系列的数学的步骤（steps）,step by step 一步步向下计算（for循环）
4. 这就需要转换一下平时的思维，需要从直观的`看`转换成`用数学一步步的去推理`

精简一下：
1. 算法需要将现实问题抽象成数学问题
2. 通过数学的一步步的推理，并将推理的结果转换成计算机的step by step的方式 交给计算机执行


### 方案
#### 1. 利用笛卡尔积方式实现