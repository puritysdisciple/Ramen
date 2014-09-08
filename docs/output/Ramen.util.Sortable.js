Ext.data.JsonP.Ramen_util_Sortable({"tagname":"class","name":"Ramen.util.Sortable","autodetected":{},"files":[{"filename":"Sortable.js","href":"Sortable.html#Ramen-util-Sortable"}],"members":[{"name":"sortTarget","tagname":"cfg","owner":"Ramen.util.Sortable","id":"cfg-sortTarget","meta":{}},{"name":"afterSort","tagname":"method","owner":"Ramen.util.Sortable","id":"method-afterSort","meta":{"template":true}},{"name":"clearSort","tagname":"method","owner":"Ramen.util.Sortable","id":"method-clearSort","meta":{}},{"name":"findInsertionIndex","tagname":"method","owner":"Ramen.util.Sortable","id":"method-findInsertionIndex","meta":{"private":true}},{"name":"sort","tagname":"method","owner":"Ramen.util.Sortable","id":"method-sort","meta":{}}],"alternateClassNames":[],"aliases":{},"id":"class-Ramen.util.Sortable","component":false,"superclasses":[],"subclasses":[],"mixedInto":["Ramen.collection.List"],"mixins":[],"parentMixins":[],"requires":[],"uses":[],"html":"<div><pre class=\"hierarchy\"><h4>Mixed into</h4><div class='dependency'><a href='#!/api/Ramen.collection.List' rel='Ramen.collection.List' class='docClass'>Ramen.collection.List</a></div><h4>Files</h4><div class='dependency'><a href='source/Sortable.html#Ramen-util-Sortable' target='_blank'>Sortable.js</a></div></pre><div class='doc-contents'><p>A mixin that adds sorting capability to a class.</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-cfg'>Config options</h3><div class='subsection'><div id='cfg-sortTarget' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Ramen.util.Sortable'>Ramen.util.Sortable</span><br/><a href='source/Sortable.html#Ramen-util-Sortable-cfg-sortTarget' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Ramen.util.Sortable-cfg-sortTarget' class='name expandable'>sortTarget</a> : String<span class=\"signature\"></span></div><div class='description'><div class='short'>The property that should be sorted ...</div><div class='long'><p>The property that should be sorted</p>\n<p>Defaults to: <code>'items'</code></p></div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-afterSort' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Ramen.util.Sortable'>Ramen.util.Sortable</span><br/><a href='source/Sortable.html#Ramen-util-Sortable-method-afterSort' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Ramen.util.Sortable-method-afterSort' class='name expandable'>afterSort</a>( <span class='pre'>me, sortedItems</span> )<span class=\"signature\"><span class='template' >template</span></span></div><div class='description'><div class='short'>Executed after a sort has taken place ...</div><div class='long'><p>Executed after a sort has taken place</p>\n      <div class='rounded-box template-box'>\n      <p>This is a <a href=\"#!/guide/components\">template method</a>.\n         a hook into the functionality of this class.\n         Feel free to override it in child classes.</p>\n      </div>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>me</span> : <a href=\"#!/api/Ramen.util.Sortable\" rel=\"Ramen.util.Sortable\" class=\"docClass\">Ramen.util.Sortable</a><div class='sub-desc'><p>The class that did the sort</p>\n</div></li><li><span class='pre'>sortedItems</span> : Mixed[]<div class='sub-desc'><p>The target of the sort</p>\n</div></li></ul></div></div></div><div id='method-clearSort' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Ramen.util.Sortable'>Ramen.util.Sortable</span><br/><a href='source/Sortable.html#Ramen-util-Sortable-method-clearSort' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Ramen.util.Sortable-method-clearSort' class='name expandable'>clearSort</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Removes the current sort. ...</div><div class='long'><p>Removes the current sort. This does not change the order of any items.</p>\n</div></div></div><div id='method-findInsertionIndex' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Ramen.util.Sortable'>Ramen.util.Sortable</span><br/><a href='source/Sortable.html#Ramen-util-Sortable-method-findInsertionIndex' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Ramen.util.Sortable-method-findInsertionIndex' class='name expandable'>findInsertionIndex</a>( <span class='pre'>newItem, [fn], [target]</span> ) : Number<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>newItem</span> : Mixed<div class='sub-desc'>\n</div></li><li><span class='pre'>fn</span> : Function (optional)<div class='sub-desc'>\n</div></li><li><span class='pre'>target</span> : Mixed[] (optional)<div class='sub-desc'>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Number</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-sort' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Ramen.util.Sortable'>Ramen.util.Sortable</span><br/><a href='source/Sortable.html#Ramen-util-Sortable-method-sort' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Ramen.util.Sortable-method-sort' class='name expandable'>sort</a>( <span class='pre'>fn</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Sorts the target based on the given comparator. ...</div><div class='long'><p>Sorts the target based on the given comparator.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>fn</span> : Function<div class='sub-desc'><p>The comparator to sort the target by</p>\n</div></li></ul></div></div></div></div></div></div></div>","meta":{}});