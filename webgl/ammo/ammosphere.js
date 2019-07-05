class AmmoSphere extends Ammo.btRigidBody
{
    constructor(radius, mass, transform)
    {
        var shape = new Ammo.btSphereShape(radius);
        var ammoTransform = new Ammo.btTransform();
        ammoTransform.setFromOpenGLMatrix(transform);
        var inertia = Vector3.zero.toAmmoVector();
        shape.calculateLocalInertia(mass, inertia);
        var motionState = new Ammo.btDefaultMotionState(ammoTransform);
        super(new Ammo.btRigidBodyConstructionInfo(mass, motionState, shape, inertia));
    }
}