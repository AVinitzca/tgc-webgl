
function AmmoSphere(radius, mass, transform)
{
    var shape = new Ammo.btSphereShape(radius);
    var ammoTransform = new Ammo.btTransform();
    ammoTransform.setFromOpenGLMatrix(transform);
    var inertia = Vector3.Zero().toAmmoVector();
    shape.calculateLocalInertia(mass, inertia);
    var motionState = new Ammo.btDefaultMotionState(ammoTransform);
    return new Ammo.btRigidBody(new Ammo.btRigidBodyConstructionInfo(mass, motionState, shape, inertia));
}
