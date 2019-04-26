
function loadMesh(name, path, after)
{
	readFile(path, name, after);
}

function readFile(path, name, after)
{
	fetch(path).then(function(element)
	{
		return element.text()
	}).then(function(element)
	{
		createMesh(name, element);
		after();
	});
}

function createMesh(name, data)
{
	var mesh = new Mesh(data);
	_meshes[name] = mesh;
}

function Mesh(objectData, options)
{
	options = options || {};
	options.materials = options.materials || {};
	options.enableWTextureCoord = !!options.enableWTextureCoord;

	// the list of unique vertex, normal, texture, attributes
	this.vertexNormals = [];
	this.textures = {};
	// the indicies to draw the faces
	this.indices = [];
	this.textureStride = options.enableWTextureCoord ? 3 : 2;

	const verts = [];
	const vertNormals = [];
	const textures = [];  
	const materialNamesByIndex = [];
      const materialIndicesByName = {};
        // keep track of what material we've seen last
      var currentMaterialIndex = -1;
      let currentObjectByMaterialIndex = 0;
	
	var unpacked = 
	{
		verts: [],
		norms: [],
		textures: [],
		hashindices: {},
		indices: [[]],
		materialIndices: [],
		index: 0,
	};

	const VERTEX_RE = /^v\s/;
	const NORMAL_RE = /^vn\s/;
	const TEXTURE_RE = /^vt\s/;
	const FACE_RE = /^f\s/;
	const WHITESPACE_RE = /\s+/;
	const USE_MATERIAL_RE = /^usemtl/;

	// array of lines separated by the newline
	const lines = objectData.split("\n");

	for (let line of lines) {
		line = line.trim();
		if (!line || line.startsWith("#")) {
			continue;
		}
		const elements = line.split(WHITESPACE_RE);
		elements.shift();

		if (VERTEX_RE.test(line)) {
			// if this is a vertex
			verts.push(...elements);
		} else if (NORMAL_RE.test(line)) {
			// if this is a vertex normal
			vertNormals.push(...elements);
		} else if (TEXTURE_RE.test(line)) {
			let coords = elements;
			// by default, the loader will only look at the U and V
			// coordinates of the vt declaration. So, this truncates the
			// elements to only those 2 values. If W texture coordinate
			// support is enabled, then the texture coordinate is
			// expected to have three values in it.
			if (elements.length > 2 && !options.enableWTextureCoord) {
				coords = elements.slice(0, 2);
			} else if (elements.length === 2 && options.enableWTextureCoord) {
				// If for some reason W texture coordinate support is enabled
				// and only the U and V coordinates are given, then we supply
				// the default value of 0 so that the stride length is correct
				// when the textures are unpacked below.
				coords.push("0");
			}
			textures.push(...coords);
		} else if (USE_MATERIAL_RE.test(line)) {
			const materialName = elements[0];

			// check to see if we've ever seen it before
			if (!(materialName in materialIndicesByName)) {
				// new material we've never seen
				materialNamesByIndex.push(materialName);
				materialIndicesByName[materialName] = materialNamesByIndex.length - 1;
				// push new array into indices
				// already contains an array at index zero, don't add
				if (materialIndicesByName[materialName] > 0) {
					unpacked.indices.push([]);
				}
			}
			// keep track of the current material index
			currentMaterialIndex = materialIndicesByName[materialName];
			// update current index array
			currentObjectByMaterialIndex = currentMaterialIndex;
		} else if (FACE_RE.test(line)) {
			// if this is a face
			/*
			split this face into an array of Vertex groups
			for example:
			   f 16/92/11 14/101/22 1/69/1
			becomes:
			  ['16/92/11', '14/101/22', '1/69/1'];
			*/

			const triangles = triangulate(elements);
			for (const triangle of triangles) {
				for (let j = 0, eleLen = triangle.length; j < eleLen; j++) {
					const hash = triangle[j] + "," + currentMaterialIndex;
					if (hash in unpacked.hashindices) {
						unpacked.indices[currentObjectByMaterialIndex].push(unpacked.hashindices[hash]);
					} else {
						/*
					Each element of the face line array is a Vertex which has its
					attributes delimited by a forward slash. This will separate
					each attribute into another array:
						'19/92/11'
					becomes:
						Vertex = ['19', '92', '11'];
					where
						Vertex[0] is the vertex index
						Vertex[1] is the texture index
						Vertex[2] is the normal index
					 Think of faces having Vertices which are comprised of the
					 attributes location (v), texture (vt), and normal (vn).
					 */
						const vertex = elements[j].split("/");
						// it's possible for faces to only specify the vertex
						// and the normal. In this case, vertex will only have
						// a length of 2 and not 3 and the normal will be the
						// second item in the list with an index of 1.
						const normalIndex = vertex.length - 1;
						/*
					 The verts, textures, and vertNormals arrays each contain a
					 flattend array of coordinates.
					 Because it gets confusing by referring to Vertex and then
					 vertex (both are different in my descriptions) I will explain
					 what's going on using the vertexNormals array:
					 vertex[2] will contain the one-based index of the vertexNormals
					 section (vn). One is subtracted from this index number to play
					 nice with javascript's zero-based array indexing.
					 Because vertexNormal is a flattened array of x, y, z values,
					 simple pointer arithmetic is used to skip to the start of the
					 vertexNormal, then the offset is added to get the correct
					 component: +0 is x, +1 is y, +2 is z.
					 This same process is repeated for verts and textures.
					 */
						// Vertex position
						unpacked.verts.push(+verts[(+vertex[0] - 1) * 3 + 0]);
						unpacked.verts.push(+verts[(+vertex[0] - 1) * 3 + 1]);
						unpacked.verts.push(+verts[(+vertex[0] - 1) * 3 + 2]);
						// Vertex textures
						if (textures.length) {
							const stride = options.enableWTextureCoord ? 3 : 2;
							unpacked.textures.push(+textures[(+vertex[1] - 1) * stride + 0]);
							unpacked.textures.push(+textures[(+vertex[1] - 1) * stride + 1]);
							if (options.enableWTextureCoord) {
								unpacked.textures.push(+textures[(+vertex[1] - 1) * stride + 2]);
							}
						}
						// Vertex normals
						unpacked.norms.push(+vertNormals[(+vertex[normalIndex] - 1) * 3 + 0]);
						unpacked.norms.push(+vertNormals[(+vertex[normalIndex] - 1) * 3 + 1]);
						unpacked.norms.push(+vertNormals[(+vertex[normalIndex] - 1) * 3 + 2]);
						// Vertex material indices
						unpacked.materialIndices.push(currentMaterialIndex);
						// add the newly created Vertex to the list of indices
						unpacked.hashindices[hash] = unpacked.index;
						unpacked.indices[currentObjectByMaterialIndex].push(unpacked.hashindices[hash]);
						// increment the counter
						unpacked.index += 1;
					}
				}
			}
		}
	}
	this.vertices = unpacked.verts;
	this.vertexNormals = unpacked.norms.map(e => parseFloat(e.toFixed(2)));
	this.textures = unpacked.textures;
	this.vertexMaterialIndices = unpacked.materialIndices;
	this.indices = unpacked.indices[currentObjectByMaterialIndex];
	this.indicesPerMaterial = unpacked.indices;

	this.materialNames = materialNamesByIndex;
	this.materialIndices = materialIndicesByName;
	this.materialsByIndex = {};

	if (options.calcTangentsAndBitangents) {
		this.calculateTangentsAndBitangents();
	}
	this.normalBuffer = _buildBuffer(gl, gl.ARRAY_BUFFER, this.vertexNormals, 3);
	this.textureBuffer = _buildBuffer(gl, gl.ARRAY_BUFFER, this.textures, this.textureStride);
	this.vertexBuffer = _buildBuffer(gl, gl.ARRAY_BUFFER, this.vertices, 3);
	this.indexBuffer = _buildBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, this.indices, 1);

	this.textures = {};
	this.transform = mat4.identity();
}





function _buildBuffer(gl, type, data, itemSize)
{
	const buffer = gl.createBuffer();
	const arrayView = (type === gl.ARRAY_BUFFER) ? Float32Array : Uint16Array;
	gl.bindBuffer(type, buffer);
	gl.bufferData(type, new arrayView(data), gl.STATIC_DRAW);
	buffer.itemSize = itemSize;
	buffer.numItems = data.length / itemSize;
	return buffer;
}

Mesh.prototype.setShader = function(shader)
{
	this.shader = shader;
}

Mesh.prototype.render = function()
{
	this.shader.use();
	this.shader.setMeshData(this);

	for (var textureName in this.textures)
	{
		this.shader.setTexture(this.textures[textureName], textureName);
	}

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
	gl.drawElements(gl.TRIANGLES, this.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}

Mesh.prototype.addTexture = function(textureName, texture)
{
	this.textures[textureName] = texture;
}

Mesh.prototype.dispose = function()
{
	gl.deleteBuffer(this.normalBuffer);
	gl.deleteBuffer(this.textureBuffer);
	gl.deleteBuffer(this.vertexBuffer);
	gl.deleteBuffer(this.indexBuffer);
}


function* triangulate(elements) 
{
	if (elements.length <= 3) 
	{	
		yield elements;
	}
	else if (elements.length === 4) 
	{
        yield [elements[0], elements[1], elements[2]];
        yield [elements[2], elements[3], elements[0]];
	}
	else 
	{
		for (let i = 1; i < elements.length - 1; i++) 
		{
			yield [elements[0], elements[i], elements[i + 1]];
		}
	}
}

