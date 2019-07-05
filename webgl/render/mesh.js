resourceLoader.load('webgl/math/gl-matrix.js');
resourceLoader.load('webgl/render/plane.js');
resourceLoader.load('webgl/render/cube.js');
resourceLoader.load('webgl/render/shaded-cube.js');
resourceLoader.load('webgl/render/cylinder.js');


class Mesh
{
	constructor(vertices, indices, normals = null, textureBuffer = null)
	{
		this.gl = Core.renderer.gl;

		if(Array.isArray(vertices))
		{
			this.vertices = vertices;
			this.vertexBuffer = _buildBuffer(this.gl, this.gl.ARRAY_BUFFER, vertices, 3);
		}
		else
		{
			this.vertices = vertices.data;
			this.vertexBuffer = _buildBuffer(this.gl, this.gl.ARRAY_BUFFER, vertices.data, vertices.size);
		}

		this.indices = indices;
		this.normals = normals;

		this.indexBuffer = _buildBuffer(this.gl, this.gl.ELEMENT_ARRAY_BUFFER, indices, 1);

		if(normals != null)
			this.normalBuffer = _buildBuffer(this.gl, this.gl.ARRAY_BUFFER, normals, 3);

		if(textureBuffer)
			this.textureBuffer = _buildBuffer(this.gl, this.gl.ARRAY_BUFFER, textureBuffer, 2);

		this.textures = {};
		this.transform = mat4.identity();

		this.shader = Core.renderer.defaultShader;
	}

	render()
	{
		this.shader.use();
		this.shader.setMeshData(this);

		for (var textureName in this.textures)
			this.shader.setTexture(this.textures[textureName], textureName);

		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
		this.gl.drawElements(this.gl.TRIANGLES, this.indexBuffer.numItems, this.gl.UNSIGNED_SHORT, 0);
	}

	addTexture(textureName, texture)
	{
		this.textures[textureName] = texture;
	}

	clearTextures()
	{
		this.textures = {};
	}

	get center()
	{
		if(this.calculatedCenter === undefined)
		{
			var calculatedCenter = vec3.createFrom(0.0, 0.0, 0.0);
			var count = this.vertices.length / 3.0;
			for(var index = 0; index < this.vertices.length; index += 3)
			{
				var vertexWeight = vec3.createFrom(this.vertices[index], this.vertices[index + 1], this.vertices[index + 2]);
				vec3.add(calculatedCenter, vertexWeight, calculatedCenter);
			}
			this.calculatedCenter = vec3.scale(calculatedCenter, 1.0 / count) ;
		}
		return this.calculatedCenter;
	}

	get radius()
	{
		if(this.calculatedRadius === undefined)
		{
			var max = 0.0;
			for(var index = 0; index < 5; index++)
			{
				var extent = (this.vertices[index] < 0.0) ? this.vertices[index] * -1.0 : this.vertices[index];
				if(extent > max)
					max = extent;
			}
			this.calculatedRadius = max;
		}
		return this.calculatedRadius;
	}

	dispose()
	{
		this.gl.deleteBuffer(this.normalBuffer);
		this.gl.deleteBuffer(this.textureBuffer);
		this.gl.deleteBuffer(this.vertexBuffer);
		this.gl.deleteBuffer(this.indexBuffer);
	}

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



function createMeshFromOBJ(objectData, options)
{
	options = options || {};
	options.materials = options.materials || {};
	options.enableWTextureCoord = !!options.enableWTextureCoord;

	// the list of unique vertex, normal, texture, attributes
	var vertexNormals = [];
	var textures = [];
	// the indicies to draw the faces
	var indices = [];
	var textureStride = options.enableWTextureCoord ? 3 : 2;

	const verts = [];
	const vertNormals = [];
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
	var vertices = unpacked.verts;
	var vertexNormals = unpacked.norms.map(e => parseFloat(e.toFixed(2)));
	var textures = unpacked.textures;
	var vertexMaterialIndices = unpacked.materialIndices;
	var indices = unpacked.indices[currentObjectByMaterialIndex];
	var indicesPerMaterial = unpacked.indices;

	var materialNames = materialNamesByIndex;
	var materialIndices = materialIndicesByName;
	var materialsByIndex = {};

	return new Mesh(vertices, indices, vertexNormals, textures);
}
