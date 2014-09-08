Ext.data.JsonP.Ramen_view_binding_Binding({"tagname":"class","name":"Ramen.view.binding.Binding","autodetected":{},"files":[{"filename":"Binding.js","href":"Binding.html#Ramen-view-binding-Binding"}],"mixins":["JSoop.mixins.Configurable","JSoop.mixins.Observable","Ramen.util.Renderable"],"members":[{"name":"baseCls","tagname":"property","owner":"Ramen.view.binding.Binding","id":"property-baseCls","meta":{}},{"name":"tpl","tagname":"property","owner":"Ramen.view.binding.Binding","id":"property-tpl","meta":{}},{"name":"constructor","tagname":"method","owner":"Ramen.view.binding.Binding","id":"method-constructor","meta":{}},{"name":"attach","tagname":"method","owner":"Ramen.view.binding.Binding","id":"method-attach","meta":{"private":true}},{"name":"destroy","tagname":"method","owner":"Ramen.view.binding.Binding","id":"method-destroy","meta":{}},{"name":"getContent","tagname":"method","owner":"Ramen.view.binding.Binding","id":"method-getContent","meta":{}},{"name":"getHtml","tagname":"method","owner":"Ramen.view.binding.Binding","id":"method-getHtml","meta":{}},{"name":"getId","tagname":"method","owner":"Ramen.view.binding.Binding","id":"method-getId","meta":{}},{"name":"getRenderData","tagname":"method","owner":"Ramen.view.binding.Binding","id":"method-getRenderData","meta":{"private":true}},{"name":"getTemplate","tagname":"method","owner":"Ramen.util.Renderable","id":"method-getTemplate","meta":{}},{"name":"initBinding","tagname":"method","owner":"Ramen.view.binding.Binding","id":"method-initBinding","meta":{"template":true}},{"name":"onOwnerRenderBefore","tagname":"method","owner":"Ramen.view.binding.Binding","id":"method-onOwnerRenderBefore","meta":{"private":true}},{"name":"onOwnerRenderDuring","tagname":"method","owner":"Ramen.view.binding.Binding","id":"method-onOwnerRenderDuring","meta":{"private":true}},{"name":"update","tagname":"method","owner":"Ramen.view.binding.Binding","id":"method-update","meta":{}}],"alternateClassNames":[],"aliases":{},"id":"class-Ramen.view.binding.Binding","short_doc":"Represents a living piece of data within a view. ...","component":false,"superclasses":[],"subclasses":["Ramen.view.binding.ModelBinding"],"mixedInto":[],"parentMixins":[],"requires":[],"uses":[],"html":"<div><pre class=\"hierarchy\"><h4>Mixins</h4><div class='dependency'>JSoop.mixins.Configurable</div><div class='dependency'>JSoop.mixins.Observable</div><div class='dependency'><a href='#!/api/Ramen.util.Renderable' rel='Ramen.util.Renderable' class='docClass'>Ramen.util.Renderable</a></div><h4>Subclasses</h4><div class='dependency'><a href='#!/api/Ramen.view.binding.ModelBinding' rel='Ramen.view.binding.ModelBinding' class='docClass'>Ramen.view.binding.ModelBinding</a></div><h4>Files</h4><div class='dependency'><a href='source/Binding.html#Ramen-view-binding-Binding' target='_blank'>Binding.js</a></div></pre><div class='doc-contents'><p>Represents a living piece of data within a view. It will update it's display when something changes. The most common\nform of binding is <a href=\"#!/api/Ramen.view.binding.ModelBinding\" rel=\"Ramen.view.binding.ModelBinding\" class=\"docClass\">Ramen.view.binding.ModelBinding</a>.</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-property'>Properties</h3><div class='subsection'><div id='property-baseCls' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Ramen.view.binding.Binding'>Ramen.view.binding.Binding</span><br/><a href='source/Binding.html#Ramen-view-binding-Binding-property-baseCls' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Ramen.view.binding.Binding-property-baseCls' class='name expandable'>baseCls</a> : String<span class=\"signature\"></span></div><div class='description'><div class='short'>The base class applied to the containing element and passed to the template ...</div><div class='long'><p>The base class applied to the containing element and passed to the template</p>\n<p>Defaults to: <code>'binding'</code></p></div></div></div><div id='property-tpl' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Ramen.view.binding.Binding'>Ramen.view.binding.Binding</span><br/><a href='source/Binding.html#Ramen-view-binding-Binding-property-tpl' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Ramen.view.binding.Binding-property-tpl' class='name expandable'>tpl</a> : String<span class=\"signature\"></span></div><div class='description'><div class='short'>The template used to render content ...</div><div class='long'><p>The template used to render content</p>\n<p>Defaults to: <code>'{{ content }}'</code></p></div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-constructor' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Ramen.view.binding.Binding'>Ramen.view.binding.Binding</span><br/><a href='source/Binding.html#Ramen-view-binding-Binding-method-constructor' target='_blank' class='view-source'>view source</a></div><strong class='new-keyword'>new</strong><a href='#!/api/Ramen.view.binding.Binding-method-constructor' class='name expandable'>Ramen.view.binding.Binding</a>( <span class='pre'>config</span> ) : <a href=\"#!/api/Ramen.view.binding.Binding\" rel=\"Ramen.view.binding.Binding\" class=\"docClass\">Ramen.view.binding.Binding</a><span class=\"signature\"></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>config</span> : Object<div class='sub-desc'>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/Ramen.view.binding.Binding\" rel=\"Ramen.view.binding.Binding\" class=\"docClass\">Ramen.view.binding.Binding</a></span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-attach' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Ramen.view.binding.Binding'>Ramen.view.binding.Binding</span><br/><a href='source/Binding.html#Ramen-view-binding-Binding-method-attach' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Ramen.view.binding.Binding-method-attach' class='name expandable'>attach</a>( <span class='pre'></span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n</div></div></div><div id='method-destroy' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Ramen.view.binding.Binding'>Ramen.view.binding.Binding</span><br/><a href='source/Binding.html#Ramen-view-binding-Binding-method-destroy' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Ramen.view.binding.Binding-method-destroy' class='name expandable'>destroy</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Destroys the binding. ...</div><div class='long'><p>Destroys the binding. This does not remove the HTMLElement associated with the binding. This should be done by\nthe view managing the binding.</p>\n</div></div></div><div id='method-getContent' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Ramen.view.binding.Binding'>Ramen.view.binding.Binding</span><br/><a href='source/Binding.html#Ramen-view-binding-Binding-method-getContent' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Ramen.view.binding.Binding-method-getContent' class='name expandable'>getContent</a>( <span class='pre'></span> ) : String<span class=\"signature\"></span></div><div class='description'><div class='short'>Retrieves the content of the binding. ...</div><div class='long'><p>Retrieves the content of the binding.</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>String</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-getHtml' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Ramen.view.binding.Binding'>Ramen.view.binding.Binding</span><br/><a href='source/Binding.html#Ramen-view-binding-Binding-method-getHtml' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Ramen.view.binding.Binding-method-getHtml' class='name expandable'>getHtml</a>( <span class='pre'></span> ) : String<span class=\"signature\"></span></div><div class='description'><div class='short'>Retrieves the complete markup for the binding that needs to be inserted into a view. ...</div><div class='long'><p>Retrieves the complete markup for the binding that needs to be inserted into a view. The includes the wrapping\nelement as well as the rendered template.</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>String</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-getId' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Ramen.view.binding.Binding'>Ramen.view.binding.Binding</span><br/><a href='source/Binding.html#Ramen-view-binding-Binding-method-getId' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Ramen.view.binding.Binding-method-getId' class='name expandable'>getId</a>( <span class='pre'></span> ) : String<span class=\"signature\"></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>String</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-getRenderData' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Ramen.view.binding.Binding'>Ramen.view.binding.Binding</span><br/><a href='source/Binding.html#Ramen-view-binding-Binding-method-getRenderData' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Ramen.view.binding.Binding-method-getRenderData' class='name expandable'>getRenderData</a>( <span class='pre'></span> ) : String<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>String</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-getTemplate' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Ramen.util.Renderable' rel='Ramen.util.Renderable' class='defined-in docClass'>Ramen.util.Renderable</a><br/><a href='source/Renderable.html#Ramen-util-Renderable-method-getTemplate' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Ramen.util.Renderable-method-getTemplate' class='name expandable'>getTemplate</a>( <span class='pre'>name</span> ) : <a href=\"#!/api/Ramen.util.Template\" rel=\"Ramen.util.Template\" class=\"docClass\">Ramen.util.Template</a><span class=\"signature\"></span></div><div class='description'><div class='short'>Retrieves a template from the class. ...</div><div class='long'><p>Retrieves a template from the class. If the property with the given name is not a template, a template will be\ncreated using the value of the property.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>name</span> : String<div class='sub-desc'><p>The name of the desired template</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/Ramen.util.Template\" rel=\"Ramen.util.Template\" class=\"docClass\">Ramen.util.Template</a></span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-initBinding' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Ramen.view.binding.Binding'>Ramen.view.binding.Binding</span><br/><a href='source/Binding.html#Ramen-view-binding-Binding-method-initBinding' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Ramen.view.binding.Binding-method-initBinding' class='name expandable'>initBinding</a>( <span class='pre'></span> )<span class=\"signature\"><span class='template' >template</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n      <div class='rounded-box template-box'>\n      <p>This is a <a href=\"#!/guide/components\">template method</a>.\n         a hook into the functionality of this class.\n         Feel free to override it in child classes.</p>\n      </div>\n</div></div></div><div id='method-onOwnerRenderBefore' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Ramen.view.binding.Binding'>Ramen.view.binding.Binding</span><br/><a href='source/Binding.html#Ramen-view-binding-Binding-method-onOwnerRenderBefore' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Ramen.view.binding.Binding-method-onOwnerRenderBefore' class='name expandable'>onOwnerRenderBefore</a>( <span class='pre'>view</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>view</span> : <a href=\"#!/api/Ramen.view.Box\" rel=\"Ramen.view.Box\" class=\"docClass\">Ramen.view.Box</a><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-onOwnerRenderDuring' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Ramen.view.binding.Binding'>Ramen.view.binding.Binding</span><br/><a href='source/Binding.html#Ramen-view-binding-Binding-method-onOwnerRenderDuring' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Ramen.view.binding.Binding-method-onOwnerRenderDuring' class='name expandable'>onOwnerRenderDuring</a>( <span class='pre'></span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n</div></div></div><div id='method-update' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Ramen.view.binding.Binding'>Ramen.view.binding.Binding</span><br/><a href='source/Binding.html#Ramen-view-binding-Binding-method-update' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Ramen.view.binding.Binding-method-update' class='name expandable'>update</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>This needs to be called whenever the binding needs to update its content. ...</div><div class='long'><p>This needs to be called whenever the binding needs to update its content.</p>\n</div></div></div></div></div></div></div>","meta":{}});