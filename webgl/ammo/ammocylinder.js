
function AmmoCylinder(radius, height, mass, transform)
{
    var shape = new Ammo.btSphereShape((new Vector3(radius, height / 2.0, radius)).toAmmoVector());
    var ammoTransform = new Ammo.btTransform();
    ammoTransform.setFromOpenGLMatrix(transform);
    var inertia = Vector3.Zero().toAmmoVector();
    shape.calculateLocalInertia(mass, inertia);
    var motionState = new Ammo.btDefaultMotionState(ammoTransform);
    return new Ammo.btRigidBody(new Ammo.btRigidBodyConstructionInfo(mass, motionState, shape, inertia));
}

function AmmoCylinderX(radius, height, mass, transform)
{
    var shape = new Ammo.btSphereShape((new Vector3(height / 2.0, radius, radius)).toAmmoVector());
    var ammoTransform = new Ammo.btTransform();
    ammoTransform.setFromOpenGLMatrix(transform);
    var inertia = Vector3.Zero().toAmmoVector();
    shape.calculateLocalInertia(mass, inertia);
    var motionState = new Ammo.btDefaultMotionState(ammoTransform);
    return new Ammo.btRigidBody(new Ammo.btRigidBodyConstructionInfo(mass, motionState, shape, inertia));
}


function AmmoCylinderZ(radius, height, mass, transform)
{
    var shape = new Ammo.btSphereShape((new Vector3(radius, radius, height / 2.0)).toAmmoVector());
    var ammoTransform = new Ammo.btTransform();
    ammoTransform.setFromOpenGLMatrix(transform);
    var inertia = Vector3.Zero().toAmmoVector();
    shape.calculateLocalInertia(mass, inertia);
    var motionState = new Ammo.btDefaultMotionState(ammoTransform);
    return new Ammo.btRigidBody(new Ammo.btRigidBodyConstructionInfo(mass, motionState, shape, inertia));
}

