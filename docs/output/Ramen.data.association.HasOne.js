Ext.data.JsonP.Ramen_data_association_HasOne({"tagname":"class","name":"Ramen.data.association.HasOne","autodetected":{},"files":[{"filename":"HasOne.js","href":"HasOne.html#Ramen-data-association-HasOne"}],"extends":"Ramen.data.association.Association","members":[{"name":"foreignKey","tagname":"cfg","owner":"Ramen.data.association.Association","id":"cfg-foreignKey","meta":{}},{"name":"mapping","tagname":"cfg","owner":"Ramen.data.association.Association","id":"cfg-mapping","meta":{"required":true}},{"name":"model","tagname":"cfg","owner":"Ramen.data.association.Association","id":"cfg-model","meta":{"required":true}},{"name":"name","tagname":"cfg","owner":"Ramen.data.association.Association","id":"cfg-name","meta":{"required":true}},{"name":"prepare","tagname":"cfg","owner":"Ramen.data.association.Association","id":"cfg-prepare","meta":{}}],"alternateClassNames":[],"aliases":{},"id":"class-Ramen.data.association.HasOne","component":false,"superclasses":["Ramen.data.association.Association"],"subclasses":[],"mixedInto":[],"mixins":[],"parentMixins":["JSoop.mixins.Configurable"],"requires":[],"uses":[],"html":"<div><pre class=\"hierarchy\"><h4>Hierarchy</h4><div class='subclass first-child'><a href='#!/api/Ramen.data.association.Association' rel='Ramen.data.association.Association' class='docClass'>Ramen.data.association.Association</a><div class='subclass '><strong>Ramen.data.association.HasOne</strong></div></div><h4>Inherited mixins</h4><div class='dependency'>JSoop.mixins.Configurable</div><h4>Files</h4><div class='dependency'><a href='source/HasOne.html#Ramen-data-association-HasOne' target='_blank'>HasOne.js</a></div></pre><div class='doc-contents'>\n</div><div class='members'><div class='members-section'><h3 class='members-title icon-cfg'>Config options</h3><div class='subsection'><div class='definedBy'>Defined By</div><h4 class='members-subtitle'>Required config options</h3><div id='cfg-mapping' class='member first-child inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Ramen.data.association.Association' rel='Ramen.data.association.Association' class='defined-in docClass'>Ramen.data.association.Association</a><br/><a href='source/Association.html#Ramen-data-association-Association-cfg-mapping' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Ramen.data.association.Association-cfg-mapping' class='name expandable'>mapping</a> : String<span class=\"signature\"><span class='required' >required</span></span></div><div class='description'><div class='short'><p>The location of the associated data.</p>\n</div><div class='long'><p>The location of the associated data.</p>\n</div></div></div><div id='cfg-model' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Ramen.data.association.Association' rel='Ramen.data.association.Association' class='defined-in docClass'>Ramen.data.association.Association</a><br/><a href='source/Association.html#Ramen-data-association-Association-cfg-model' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Ramen.data.association.Association-cfg-model' class='name expandable'>model</a> : String<span class=\"signature\"><span class='required' >required</span></span></div><div class='description'><div class='short'><p>The type of model this association will create</p>\n</div><div class='long'><p>The type of model this association will create</p>\n</div></div></div><div id='cfg-name' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Ramen.data.association.Association' rel='Ramen.data.association.Association' class='defined-in docClass'>Ramen.data.association.Association</a><br/><a href='source/Association.html#Ramen-data-association-Association-cfg-name' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Ramen.data.association.Association-cfg-name' class='name expandable'>name</a> : String<span class=\"signature\"><span class='required' >required</span></span></div><div class='description'><div class='short'>The name of this association. ...</div><div class='long'><p>The name of this association. This will be used to create getters on the parent model.</p>\n</div></div></div></div><div class='subsection'><div class='definedBy'>Defined By</div><h4 class='members-subtitle'>Optional config options</h3><div id='cfg-foreignKey' class='member first-child inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Ramen.data.association.Association' rel='Ramen.data.association.Association' class='defined-in docClass'>Ramen.data.association.Association</a><br/><a href='source/Association.html#Ramen-data-association-Association-cfg-foreignKey' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Ramen.data.association.Association-cfg-foreignKey' class='name expandable'>foreignKey</a> : String<span class=\"signature\"></span></div><div class='description'><div class='short'><p>The name of the field that contains the foreign key.</p>\n</div><div class='long'><p>The name of the field that contains the foreign key.</p>\n</div></div></div><div id='cfg-prepare' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Ramen.data.association.Association' rel='Ramen.data.association.Association' class='defined-in docClass'>Ramen.data.association.Association</a><br/><a href='source/Association.html#Ramen-data-association-Association-cfg-prepare' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Ramen.data.association.Association-cfg-prepare' class='name expandable'>prepare</a> : Function/String<span class=\"signature\"></span></div><div class='description'><div class='short'>A function, or name of a function, that will be used to prepare the data prior to association. ...</div><div class='long'><p>A function, or name of a function, that will be used to prepare the data prior to association. If a function name\nis given, the function will be pulled from the parent model.</p>\n</div></div></div></div></div></div></div>","meta":{}});