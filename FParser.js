var FParser= function( syntaxes ){
	var regexp= []
	var handlers= []
	for( var name in syntaxes ){
		var syntax= syntaxes[ name ]
		var re= syntax.regexp
		regexp.push( re.source || re )
		handlers.push( syntax.handler )
	}
	regexp= RegExp( '([\\s\\S]*?)((' + regexp.join( ')|(' ) + ')|$)', 'g' )
	return FCached( function( str ){
		var pos= 0
		var content= []
		parsing: while( pos < str.length ){
			regexp.lastIndex= pos
			var found= regexp.exec( str )
			pos= regexp.lastIndex
			var prefix= found[1]
			if( prefix ) content.push( prefix )
			if( !found[2] ) continue parsing

			var valN= 4
			searchingHanler: for( var i= 0; i < handlers.length; ++i ){
	            var handler= handlers[ i ]
	            var argsCount= handler.length
	            if( found[ valN - 1 ] ){
		            var args= found.slice( valN, valN + argsCount )
		            content.push( handler.apply( this, args ) )
		            break searchingHanler
		        }
                valN+= argsCount + 1
			}
		}
		return content
	})
}

FParser.FWrapper= FCached( function( name ){
	return function( val ){
		var obj= {}
		obj[ name ]= val
		return obj
	}
})

FParser.lang= {}
